import type { SearchResponse } from '@nuxtjs/algolia'

import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore'

export default function () {
  const { firestore } = useFirebase()
  const { twitchUsername } = useRuntimeConfig().public

  function getMessages(start: string, end: string, order: SortOrder, callback: (docs: Message[]) => void) {
    const q = query(
      collection(firestore, 'messages'),
      where('sentAt', '>=', start),
      where('sentAt', '<=', end),
      where('username', '==', twitchUsername),
      orderBy('sentAt', order),
    )

    return onSnapshot(q, (querySnapshot) => {
      const docs = querySnapshot.docs.map(doc => doc.data() as Message)
      callback(docs)
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
      const docs = querySnapshot.docs.map(doc => doc.data() as Message)
      callback(docs)
    })
  }

  async function searchMessages(result: SearchResponse<globalThis.AlgoliaIndex>) {
    try {
      const q = query(
        collection(firestore, 'messages'),
        where('username', '==', twitchUsername),
        where('__name__', 'in', result.hits.map(hit => hit.objectID)),
      )

      const querySnapshot = await getDocs(q)
      const hitOrder = result.hits.map(hit => hit.objectID)

      return querySnapshot.docs
        .map(doc => doc.data() as Message)
        .sort((a, b) => hitOrder.indexOf(a.id) - hitOrder.indexOf(b.id))
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
