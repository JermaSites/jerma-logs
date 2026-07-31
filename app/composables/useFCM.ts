import { httpsCallable } from 'firebase/functions'
import { getMessaging, getToken, isSupported } from 'firebase/messaging'

const vapidKey = 'BBzAmYU-18pvRnM2vrdMwWz3vHZfT6BErkcg9L7A0IghKslryeDwuZ0sSiMGD75__jsjpjbO2xkVVxKIa6UE3W8'

export default function () {
  const token = useState<string | null>('fcm-token', () => null)

  async function getFCMToken() {
    if (token.value)
      return token.value

    const { app } = useFirebase()
    if (!app)
      return null

    try {
      token.value = await getToken(getMessaging(app), { vapidKey })
      return token.value
    }
    catch (error) {
      console.error('Error getting FCM token:', error)
      return null
    }
  }

  async function getTokenAndSubscribeToTopic(topic: string) {
    const { functions } = useFirebase()
    if (!functions)
      return

    const subscribeToTopic = httpsCallable(functions, 'subscribeToTopic')

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
    const { functions } = useFirebase()
    if (!functions)
      return

    const unsubscribeFromTopic = httpsCallable(functions, 'unsubscribeFromTopic')

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
