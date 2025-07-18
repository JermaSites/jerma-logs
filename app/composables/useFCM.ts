import { httpsCallable } from 'firebase/functions'
import { getMessaging, getToken, isSupported } from 'firebase/messaging'

export function useFCM() {
  const { $firebase } = useNuxtApp()

  const vapidKey = 'BBzAmYU-18pvRnM2vrdMwWz3vHZfT6BErkcg9L7A0IghKslryeDwuZ0sSiMGD75__jsjpjbO2xkVVxKIa6UE3W8'

  async function getFCMToken() {
    try {
      return await getToken(getMessaging($firebase.app), { vapidKey })
    }
    catch (error) {
      console.error('Error getting FCM token:', error)
      return ''
    }
  }

  async function getTokenAndSubscribeToTopic(topic: string) {
    const subscribeToTopic = httpsCallable($firebase.functions, 'subscribeToTopic')

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
    const unsubscribeFromTopic = httpsCallable($firebase.functions, 'unsubscribeFromTopic')

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

  return {
    isSupported,
    getTokenAndSubscribeToTopic,
    getTokenAndUnsubscribeToTopic,
  }
}
