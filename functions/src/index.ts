import { messaging } from 'firebase-admin'
import { initializeApp } from 'firebase-admin/app'
import {
  onDocumentCreated,
  onDocumentWritten,
} from 'firebase-functions/v2/firestore'
import { onCall } from 'firebase-functions/v2/https'
import type { Message } from './types'

initializeApp()

exports.subscribeToTopic = onCall((request) => {
  const { token, topic } = request.data
  return messaging().subscribeToTopic(token, topic)
})

exports.unsubscribeFromTopic = onCall((request) => {
  const { token, topic } = request.data
  return messaging().unsubscribeFromTopic(token, topic)
})

exports.sendMessageNotification = onDocumentCreated(
  '/messages/{documentId}',
  async (event) => {
    if (!event.data)
      return

    const { message, username } = event.data.data() as Message

    if (username !== 'jerma985')
      return

    // Notification details.
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

    return messaging().send(payload)
  },
)

exports.sendSusNotification = onDocumentCreated(
  '/sus/{documentId}',
  async (event) => {
    if (!event.data)
      return

    const { message, username, mod } = event.data.data() as Message

    if (username !== 'jerma985' && !mod)
      return

    const susRegExp = /^!(commands\s+edit|editcom)\s+(-cd=\d+\s+)?(!sus)\s(-cd=\d+\s)?(?<susMessage>.+)$/

    const sus = message.match(susRegExp)?.groups?.susMessage

    // Notification details.
    const payload = {
      topic: 'sus',
      webpush: {
        notification: {
          title: `${username} update the SUS`,
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

    return messaging().send(payload)
  },
)

exports.sendTestNotification = onDocumentWritten(
  '/test/{documentId}',
  async (event) => {
    if (!event.data)
      return

    const { message } = event.data.after.data() as Message

    // Notification details.
    // https://firebase.google.com/docs/reference/admin/node/firebase-admin.messaging.webpushnotification.md#webpushnotification_interface
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

    return messaging().send(payload)
  },
)
