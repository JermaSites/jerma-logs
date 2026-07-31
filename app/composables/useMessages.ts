import type { SearchResponse } from '@nuxtjs/algolia'

import {
  collection,
  documentId,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore'

/** Firestore caps `in` filters at 30 values per query. */
const IN_QUERY_LIMIT = 30

export default function () {
  const { firestore } = useFirebase()
  const { twitchUsername } = useRuntimeConfig().public

  function getMessages(start: string, end: string, callback: (docs: Message[]) => void) {
    const q = query(
      collection(firestore, 'messages'),
      where('sentAt', '>=', start),
      where('sentAt', '<=', end),
      where('username', '==', twitchUsername),
      orderBy('sentAt', 'asc'),
    )

    return onSnapshot(q, (querySnapshot) => {
      callback(querySnapshot.docs.map(doc => doc.data() as Message))
    })
  }

  function getLatestMessages(timestamp: string, callback: (docs: Message[]) => void) {
    const dayOfLatestMessage = getDayOfLatestMessage(Number.parseInt(timestamp))

    const q = query(
      collection(firestore, 'messages'),
      where('username', '==', twitchUsername),
      where('sentAt', '>=', dayOfLatestMessage),
    )

    return onSnapshot(q, (querySnapshot) => {
      callback(querySnapshot.docs.map(doc => doc.data() as Message))
    })
  }

  async function searchMessages(result: SearchResponse<globalThis.AlgoliaIndex>) {
    const ids = result.hits.map(hit => hit.objectID)

    if (!ids.length)
      return []

    const chunks: string[][] = []
    for (let i = 0; i < ids.length; i += IN_QUERY_LIMIT) {
      chunks.push(ids.slice(i, i + IN_QUERY_LIMIT))
    }

    try {
      const snapshots = await Promise.all(chunks.map(chunk => getDocs(query(
        collection(firestore, 'messages'),
        where('username', '==', twitchUsername),
        where(documentId(), 'in', chunk),
      ))))

      // Firestore returns documents in its own order; restore Algolia's ranking.
      const hitOrder = new Map(ids.map((id, index) => [id, index]))

      return snapshots
        .flatMap(snapshot => snapshot.docs.map(doc => doc.data() as Message))
        .sort((a, b) => (hitOrder.get(a.id) ?? 0) - (hitOrder.get(b.id) ?? 0))
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  return {
    getMessages,
    getLatestMessages,
    searchMessages,
  }
}
