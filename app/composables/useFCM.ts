import { httpsCallable } from 'firebase/functions'
import { getMessaging, getToken, isSupported } from 'firebase/messaging'

const { app, functions } = useFirebase()

const subscribeToTopic = httpsCallable(functions, 'subscribeToTopic')

const unsubscribeFromTopic = httpsCallable(functions, 'unsubscribeFromTopic')

async function getFCMToken() {
  const vapidKey = 'BBzAmYU-18pvRnM2vrdMwWz3vHZfT6BErkcg9L7A0IghKslryeDwuZ0sSiMGD75__jsjpjbO2xkVVxKIa6UE3W8'

  try {
    return await getToken(getMessaging(app), { vapidKey })
  }
  catch (error) {
    console.error('Error getting FCM token:', error)
    return ''
  }
}

async function getTokenAndSubscribeToTopic(topic: string) {
  try {
    const currentToken = await getFCMToken()

    await subscribeToTopic({
      token: currentToken,
      topic,
    })
  }
  catch (error) {
    console.error(`Error subscribing FCM token to topic "${topic}":`, error)
  }
}

async function getTokenAndUnsubscribeToTopic(topic: string) {
  try {
    const currentToken = await getFCMToken()

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
  return { isSupported, getTokenAndSubscribeToTopic, getTokenAndUnsubscribeToTopic }
}
