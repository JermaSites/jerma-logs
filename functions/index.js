const functions = require('firebase-functions')
const moment = require('moment')

const admin = require('firebase-admin')
admin.initializeApp()

exports.sendNotification = functions.firestore.document('/messages/{documentId}')
  .onCreate(async (snap, context) => {
    const querySnapshot = await admin.firestore().collection('subscribers').get()
    const messsageData = snap.data()
    const month = moment(messsageData.sentAt).format('MMMM')
    const year = moment(messsageData.sentAt).format('YYYY')

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
        body: messsageData.message,
        icon: 'https://logs.jerma.io/logo.png',
        click_action: `https://logs.jerma.io/${year}/${month}`
      }
    }

    return admin.messaging().sendToDevice(tokens, payload)
  })

exports.sendTestNotification = functions.firestore.document('/test/{documentId}')
  .onWrite(async (change, context) => {
    const messsageData = change.after.data()
    const month = moment(context.timestamp).format('MMMM')
    const year = moment(context.timestamp).format('YYYY')
    console.log(`https://logs.jerma.io/${year}/${month}`)
    const url = `https://logs.jerma.io/${year}/${month}`
    const tokens = messsageData.tokens

    // Notification details.
    const payload = {
      notification: {
        tag: 'jerma',
        title: 'Test Message',
        body: messsageData.message,
        icon: 'https://logs.jerma.io/logo.png',
        click_action: url
      }
    }

    return admin.messaging().sendToDevice(tokens, payload)
  })
