import type { MessagesResponse } from '@/types'
import { parse } from 'firestore-rest-parser'

export default cachedEventHandler(
  async () => {
    const url = `https://firestore.googleapis.com/v1beta1/projects/jerma-logs/databases/(default)/documents:runQuery`
    const sus = await $fetch<MessagesResponse>(url, {
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
  },
  {
    maxAge: 60 * 60,
  },
)
