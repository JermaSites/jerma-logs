import { initializeApp } from 'firebase-admin/app'
import { messaging } from 'firebase-admin'
import { onCall } from 'firebase-functions/v2/https'
import {
  onDocumentCreated,
  onDocumentWritten,
} from 'firebase-functions/v2/firestore'
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
      notification: {
        tag: 'message',
        title: 'Jerma in Twitch chat',
        body: message,
        icon: '/logo.png',
        clickAction: '/latest',
      },
    }

    return messaging().sendToTopic('message', payload)
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
      notification: {
        tag: 'sus',
        title: `${username} update the SUS`,
        body: sus,
        icon: '/logo.png',
        clickAction: '/',
      },
    }

    return messaging().sendToTopic('sus', payload)
  },
)

exports.sendTestNotification = onDocumentWritten(
  '/test/{documentId}',
  async (event) => {
    if (!event.data)
      return

    const { message } = event.data.after.data() as Message

    // Notification details.
    const payload = {
      notification: {
        tag: 'test',
        title: 'Test Message',
        body: message,
        icon: '/logo.png',
        clickAction: '/Test',
      },
      data: {
        url: 'https://logs.jerma.io/latest',
      },
    }

    return messaging().sendToTopic('test', payload)
  },
)
