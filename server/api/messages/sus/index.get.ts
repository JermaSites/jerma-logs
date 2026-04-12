import { parse } from 'firestore-rest-parser'

const { firebaseApiUrl } = useRuntimeConfig().public

export default defineCachedEventHandler(async () => {
  try {
    const queryData = {
      structuredQuery: {
        from: [
          {
            collectionId: 'sus',
          },
        ],
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

    const sus = await $fetch<MessagesResponse>(firebaseApiUrl, {
      method: 'POST',
      body: queryData,
    })

    return sus.map(doc => parse(doc.document)).pop()
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch SUS message',
      data: error,
    })
  }
}, {
  maxAge: 60 * 60, // 1 hour
})
