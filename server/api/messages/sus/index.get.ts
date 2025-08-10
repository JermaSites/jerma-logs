import { parse } from 'firestore-rest-parser'

const { firebaseApiUrl } = useRuntimeConfig().public

export default defineCachedEventHandler(async () => {
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
}, {
  maxAge: 60 * 60, // 1 hour
})
