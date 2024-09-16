import type { MessagesResponse } from '@/types'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'

import { parse } from 'firestore-rest-parser'

dayjs.extend(utc)

const { firebaseApiUrl, twitchUsername } = useRuntimeConfig().public

export default defineEventHandler(async () => {
  const latestMessageQueryData = {
    structuredQuery: {
      from: [
        {
          collectionId: 'messages',
        },
      ],
      where: {
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
      orderBy: [
        {
          field: {
            fieldPath: 'sentAt',
          },
          direction: 'DESCENDING',
        },
      ],
      limit: 1,
    },
  }

  const latestMessageQuery = await $fetch<MessagesResponse>(firebaseApiUrl, {
    method: 'POST',
    body: latestMessageQueryData,
  })

  const latestMessage = latestMessageQuery
    .map(doc => parse(doc.document))
    .pop()

  if (!latestMessage)
    return []

  const dayOfLatestMessage = dayjs
    .utc(Number.parseInt(latestMessage.sentAt))
    .subtract(1, 'day')
    .valueOf()
    .toString()

  const latestMessagesQueryData = {
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
                value: { stringValue: dayOfLatestMessage },
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

  const latestMessagesQuery = await $fetch<MessagesResponse>(firebaseApiUrl, {
    method: 'POST',
    body: latestMessagesQueryData,
  })

  const messages = latestMessagesQuery.map((doc) => {
    return parse(doc.document)
  })

  return messages
})
