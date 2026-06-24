import type { Message } from './types'
import { initializeApp } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'
import {
  onDocumentCreated,
  onDocumentWritten,
} from 'firebase-functions/v2/firestore'
import { onCall } from 'firebase-functions/v2/https'

initializeApp()

const susRegExp = /^!(commands\s+edit|editcom)\s+(-cd=\d+\s+)?(!sus)\s(-cd=\d+\s)?(?<susMessage>.+)$/

export const subscribeToTopic = onCall<{ token: string; topic: string }>((request) => {
  const { token, topic } = request.data
  return getMessaging().subscribeToTopic(token, topic)
})

export const unsubscribeFromTopic = onCall<{ token: string; topic: string }>((request) => {
  const { token, topic } = request.data
  return getMessaging().unsubscribeFromTopic(token, topic)
})

export const sendMessageNotification = onDocumentCreated(
  '/messages/{documentId}',
  async (event) => {
    if (!event.data)
      return

    const { message, username } = event.data.data() as Message

    if (username !== 'jerma985')
      return

    const payload = {
      topic: 'message',
      webpush: {
        notification: {
          title: 'Jerma in Twitch chat',
          body: message,
          icon: '/logo.png',
          tag: 'message',
          renotify: false,
        },
        fcmOptions: {
          link: 'https://logs.jerma.io/latest',
        },
      },
    }

    return getMessaging().send(payload)
  },
)

export const sendSusNotification = onDocumentCreated(
  '/sus/{documentId}',
  async (event) => {
    if (!event.data)
      return

    const { message, username, mod } = event.data.data() as Message

    if (username !== 'jerma985' && !mod)
      return

    const sus = message.match(susRegExp)?.groups?.susMessage

    if (!sus)
      return

    const payload = {
      topic: 'sus',
      webpush: {
        notification: {
          title: `${username} updated the SUS`,
          body: sus,
          icon: '/logo.png',
          tag: 'sus',
          renotify: false,
        },
        fcmOptions: {
          link: 'https://logs.jerma.io/',
        },
      },
    }

    return getMessaging().send(payload)
  },
)

export const sendTestNotification = onDocumentWritten(
  '/test/{documentId}',
  async (event) => {
    if (!event.data)
      return

    const afterData = event.data.after.data()
    if (!afterData)
      return

    const { message } = afterData as Message

    const payload = {
      topic: 'test',
      webpush: {
        notification: {
          title: 'Test Message',
          body: message,
          icon: '/logo.png',
          tag: 'test',
          renotify: false,
        },
        fcmOptions: {
          link: 'https://logs.jerma.io/',
        },
      },
    }

    return getMessaging().send(payload)
  },
)
