import type { MessagesResponse } from '@/types'
import { parse } from 'firestore-rest-parser'

const { firebaseApiUrl } = useRuntimeConfig().public

export default defineEventHandler(
  async () => {
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
  },
)
