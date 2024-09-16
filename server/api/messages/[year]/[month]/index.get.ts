import type { MessagesResponse } from '@/types'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import { parse } from 'firestore-rest-parser'
import { useCapitalize } from '~/composables/useCapitalize.js'

dayjs.extend(utc)

const { capitalize } = useCapitalize()
const { firebaseApiUrl, twitchUsername } = useRuntimeConfig().public

export default defineEventHandler(
  async (event) => {
    const { year, month } = getRouterParams(event)
    const { limit } = getQuery(event)

    const date = dayjs(`${year}-${capitalize(month)}-01`, 'YYYY-MMMM-DD')
    const startTime = date.startOf('month').valueOf().toString()
    const endTime = date.endOf('month').valueOf().toString()

    // https://firebase.google.com/docs/firestore/reference/rest/v1/StructuredQuery
    const queryData = {
      structuredQuery: {
        from: [
          {
            collectionId: 'messages',
          },
        ],
        where: {
          compositeFilter: {
            op: 'AND',
            filters: [
              {
                fieldFilter: {
                  field: {
                    fieldPath: 'username',
                  },
                  op: 'EQUAL',
                  value: {
                    stringValue: twitchUsername,
                  },
                },
              },
              {
                fieldFilter: {
                  field: {
                    fieldPath: 'sentAt',
                  },
                  op: 'GREATER_THAN_OR_EQUAL',
                  value: { stringValue: startTime },
                },
              },
              {
                fieldFilter: {
                  field: {
                    fieldPath: 'sentAt',
                  },
                  op: 'LESS_THAN_OR_EQUAL',
                  value: { stringValue: endTime },
                },
              },
            ],
          },
        },
        orderBy: [
          {
            field: {
              fieldPath: 'sentAt',
            },
            direction: 'DESCENDING',
          },
        ],
      },
    }

    if (limit) {
      queryData.structuredQuery.limit = limit
    }

    const messagesQuery = await $fetch<MessagesResponse>(firebaseApiUrl, {
      method: 'POST',
      body: queryData,
    })

    console.log(messagesQuery.length)

    if (messagesQuery.length <= 1)
      return []

    const messages = messagesQuery.map((doc) => {
      return parse(doc.document)
    })

    return messages
  },
)
