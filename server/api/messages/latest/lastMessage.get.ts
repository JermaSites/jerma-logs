import { parse } from 'firestore-rest-parser'

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

  return latestMessage
})
