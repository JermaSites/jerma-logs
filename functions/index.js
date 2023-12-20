const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

exports.subscribeToTopic = functions.https.onCall((data, context) => {
  const { token, topic } = data;
  return admin.messaging().subscribeToTopic(token, topic);
});

exports.unsubscribeFromTopic = functions.https.onCall((data, context) => {
  const { token, topic } = data;
  return admin.messaging().unsubscribeFromTopic(token, topic);
});

exports.sendMessageNotification = functions.firestore
  .document("/messages/{documentId}")
  .onCreate(async (snap, context) => {
    const messsageData = snap.data();
    if (messsageData.username !== "jerma985") return;

    // Notification details.
    const payload = {
      notification: {
        tag: "jerma",
        title: "Jerma in Twitch chat",
        body: messsageData.message,
        icon: "https://logs.jerma.io/logo.png",
        click_action: `https://logs.jerma.io/Latest`,
      },
    };

    return admin.messaging().sendToTopic("message", payload);
  });

exports.sendSusNotification = functions.firestore
  .document("/sus/{documentId}")
  .onCreate(async (snap, context) => {
    const messsageData = snap.data();
    if (messsageData.username !== "jerma985" && !messsageData.mod) return;

    // Notification details.
    const payload = {
      notification: {
        tag: "sus",
        title: "You cast SUS!",
        body: messsageData.message,
        icon: "https://logs.jerma.io/logo.png",
        click_action: `https://logs.jerma.io/`,
      },
    };

    return admin.messaging().sendToTopic("sus", payload);
  });

exports.sendTestNotification = functions.firestore
  .document("/test/{documentId}")
  .onWrite(async (change, context) => {
    const messsageData = change.after.data();

    // Notification details.
    const payload = {
      notification: {
        tag: "test",
        title: "Test Message",
        body: messsageData.message,
        icon: "https://logs.jerma.io/logo.png",
        click_action: `https://logs.jerma.io/`,
      },
    };

    return admin.messaging().sendToTopic("test", payload);
  });
