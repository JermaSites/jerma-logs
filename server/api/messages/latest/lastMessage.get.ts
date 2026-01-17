import { parse } from 'firestore-rest-parser'

const { firebaseApiUrl, twitchUsername } = useRuntimeConfig().public

export default defineCachedEventHandler(async () => {
  try {
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

    return latestMessageData
      .map(doc => parse(doc.document))
      .pop()
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch last messages',
      data: error,
    })
  }
}, {
  maxAge: 60 * 60, // 1 hour
})
