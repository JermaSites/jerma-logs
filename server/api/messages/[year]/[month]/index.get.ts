import dayjs from 'dayjs'
import { parse } from 'firestore-rest-parser'

const { firebaseApiUrl, twitchUsername } = useRuntimeConfig().public

export default defineEventHandler(async (event) => {
  try {
    const { year, month } = getRouterParams(event)
    const { order = 'desc' } = getQuery(event)

    if (!year || !month) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Year and month required',
      })
    }

    const date = dayjs(`${year}-${capitalize(month)}-01`, 'YYYY-MMMM-DD')

    if (!date.isValid()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid date',
      })
    }

    const startTime = date.startOf('month').valueOf().toString()
    const endTime = date.endOf('month').valueOf().toString()

    // https://firebase.google.com/docs/firestore/reference/rest/v1/StructuredQuery
    const messagesQuery = {
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
            direction: order === 'asc' ? 'ASCENDING' : 'DESCENDING',
          },
        ],
      },
    }

    const messagesData = await $fetch<MessagesResponse>(firebaseApiUrl, {
      method: 'POST',
      body: messagesQuery,
    })

    if (messagesData.length <= 1)
      return []

    return messagesData.map(doc => parse(doc.document))
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch messages',
    })
  }
})
