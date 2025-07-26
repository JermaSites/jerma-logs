import type { SearchResponse } from '@nuxtjs/algolia'

import type { SortOrder } from '~~/shared/types'

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

  const messages = ref<Message[]>([])

  function getMessages(start: string, end: string, order: SortOrder) {
    const q = query(
      collection(firestore, 'messages'),
      where('sentAt', '>=', start),
      where('sentAt', '<=', end),
      where('username', '==', twitchUsername),
      orderBy('sentAt', order),
    )

    return onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.docs.length === 0)
        return
      messages.value = querySnapshot.docs.map(doc => doc.data() as Message)
    })
  }

  function getLatestMessages(timestamp: string) {
    const dayOfLatestMessage = getDayOfLatestMessage(Number.parseInt(timestamp))

    const q = query(
      collection(firestore, 'messages'),
      where('username', '==', twitchUsername),
      where('sentAt', '>=', dayOfLatestMessage),
    )

    return onSnapshot(q, (querySnapshot) => {
      messages.value = querySnapshot.docs.map(doc => doc.data() as Message)
    })
  }

  async function searchMessages(result: SearchResponse<globalThis.AlgoliaIndex>) {
    const q = query(
      collection(firestore, 'messages'),
      where('username', '==', twitchUsername),
      where('__name__', 'in', result.hits.map(hit => hit.objectID)),
    )

    const querySnapshot = await getDocs(q)

    messages.value = querySnapshot.docs.map(doc => doc.data() as Message)
  }

  return {
    messages,
    getMessages,
    getLatestMessages,
    searchMessages,
  }
}
