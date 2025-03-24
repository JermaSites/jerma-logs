import type { Messaging } from 'firebase/messaging'
import { httpsCallable } from 'firebase/functions'
import { getToken } from 'firebase/messaging'

const { functions } = useFirebase()

const subscribeToTopic = httpsCallable(functions, 'subscribeToTopic')

const unsubscribeFromTopic = httpsCallable(functions, 'unsubscribeFromTopic')

async function getFCMToken(messaging: Messaging) {
  const vapidKey = 'BBzAmYU-18pvRnM2vrdMwWz3vHZfT6BErkcg9L7A0IghKslryeDwuZ0sSiMGD75__jsjpjbO2xkVVxKIa6UE3W8'

  try {
    return await getToken(messaging, { vapidKey })
  }
  catch (error) {
    console.error('Error getting FCM token:', error)
    return ''
  }
}

async function getTokenAndSubscribeToTopic(
  messaging: Messaging,
  topic: string,
) {
  try {
    const currentToken = await getFCMToken(messaging)

    await subscribeToTopic({
      token: currentToken,
      topic,
    })
  }
  catch (error) {
    console.error(`Error subscribing FCM token to topic "${topic}":`, error)
  }
}

async function getTokenAndUnsubscribeToTopic(
  messaging: Messaging,
  topic: string,
) {
  try {
    const currentToken = await getFCMToken(messaging)

    await unsubscribeFromTopic({
      token: currentToken,
      topic,
    })
  }
  catch (error) {
    console.error(`Error unsubscribing FCM token to topic "${topic}":`, error)
  }
}

export function useFCM() {
  return { getTokenAndSubscribeToTopic, getTokenAndUnsubscribeToTopic }
}
