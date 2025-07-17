import type { MessagesResponse } from '@/../types'

import { parse } from 'firestore-rest-parser'
import { getDayOfLatestMessage } from '~/utils/latestMessageUtils'

const { firebaseApiUrl, twitchUsername } = useRuntimeConfig().public

export default defineEventHandler(async () => {
  const latestMessageQuery = {
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

  const latestMessageData = await $fetch<MessagesResponse>(firebaseApiUrl, {
    method: 'POST',
    body: latestMessageQuery,
  })

  const latestMessage = latestMessageData
    .map(doc => parse(doc.document))
    .pop()

  if (!latestMessage)
    return []

  const dayOfLatestMessage = getDayOfLatestMessage(Number.parseInt(latestMessage.sentAt))

  const latestMessagesQuery = {
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

  const latestMessagesData = await $fetch<MessagesResponse>(firebaseApiUrl, {
    method: 'POST',
    body: latestMessagesQuery,
  })

  const messages = latestMessagesData.map((doc) => {
    return parse(doc.document)
  })

  return messages
})
