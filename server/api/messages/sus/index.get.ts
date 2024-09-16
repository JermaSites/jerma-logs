import type { MessagesResponse } from '@/types'
import { parse } from 'firestore-rest-parser'

const { firebaseApiUrl } = useRuntimeConfig().public

export default defineCachedEventHandler(
  async () => {
    try {
      const sus = await $fetch<MessagesResponse>(firebaseApiUrl, {
        method: 'POST',

        body: {
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
        },
      })

      return sus.map(doc => parse(doc.document)).pop()
    }
    catch (error) {
      return error
    }
  },
  {
    maxAge: 60 * 60,
  },
)
