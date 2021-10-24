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
        body: messsageData.message,
        icon: 'https://logs.jerma.io/logo.png',
        click_action: 'https://logs.jerma.io/'
      }
    }

    return admin.messaging().sendToDevice(tokens, payload)
  })

exports.sendTestNotification = functions.firestore.document('/test/{documentId}')
  .onCreate(async (snap, context) => {
    const messsageData = snap.data()

    const tokens = ['edCXwlTmVSE_fqiMjR_9Xa:APA91bEx8oTSw-_G4n0koc9olA6JJRURTtHw0TIpUGwn4v0BQ_xCI0iCZvF-7HKU-8Nd2Xe9qln-tTYz93CA0-Q2yzvXsYP-IdAU80RaXb8_xnyo7OxlBBXySdE8e1Qe9pIrb3GFSk88']

    // Notification details.
    const payload = {
      notification: {
        tag: 'jerma',
        title: 'Test Message',
        body: messsageData.message,
        icon: 'https://logs.jerma.io/logo.png',
        click_action: 'https://logs.jerma.io/'
      }
    }

    return admin.messaging().sendToDevice(tokens, payload)
  })
