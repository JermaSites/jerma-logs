const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp()

exports.sendNotification = functions.firestore.document('/messages/{documentId}')
  .onCreate(async (snap, context) => {
    const querySnapshot = await admin.firestore().collection('subscribers').get()
    const messsageData = snap.data()

    const tokens = []
    querySnapshot.forEach(doc => {
      const { token } = doc.data()
      tokens.push(token)
    })

    // Notification details.
    const payload = {
      notification: {
        tag: 'jerma',
        title: 'Jerma in Twitch chat',
        body: messsageData.message
      }
    }

    return admin.messaging().sendToDevice(tokens, payload)
  })
