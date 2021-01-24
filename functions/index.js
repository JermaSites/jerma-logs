const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp()

exports.sendNotification = functions.firestore.document('/messages/{documentId}')
  .onCreate(async (snap, context) => {
    if (context.username !== 'jerma985') return null
    const querySnapshot = await admin.firestore().collection('subscribers').get()
    const messageDoc = await admin.firestore().collection('messages').doc(context.params.documentId).get()
    const messsageData = messageDoc.data()

    const messagesSnap = await admin.firestore().collection('messages').orderBy('sentAt', 'desc').limit(2).get()
    const messages = []
    messagesSnap.forEach(msg => {
      messages.push(msg.data())
    })

    const timeSinceLastMessageMillis = parseInt(messages[0].sentAt) - parseInt(messages[1].sentAt)
    const timeSinceLastMessageSeconds = timeSinceLastMessageMillis / 1000
    const timeSinceLastMessageHours = timeSinceLastMessageSeconds / 3600

    if (timeSinceLastMessageHours < 1) return null

    const tokens = []
    querySnapshot.forEach(doc => {
      const { token } = doc.data()
      console.log(token)
      tokens.push(token)
    })

    // Notification details.
    const payload = {
      notification: {
        title: 'Jerma is in Twitch chat now!',
        body: messsageData.message
      }
    }

    return admin.messaging().sendToDevice(tokens, payload)
  })
