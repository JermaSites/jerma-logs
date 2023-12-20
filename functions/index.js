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
      data: {
        tag: "jerma",
        title: "Jerma in Twitch chat",
        body: messsageData.message,
        data: "/Latest",
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
      data: {
        tag: "sus",
        title: "You cast SUS!",
        body: messsageData.message,
        data: "/",
      },
    };

    return admin.messaging().sendToTopic("sus", payload);
  });

exports.sendTestNotification = functions.firestore
  .document("/test/{documentId}")
  .onWrite(async (change, context) => {
    const { message } = change.after.data();

    // Notification details.
    const payload = {
      data: {
        tag: "test",
        title: "Test Message",
        body: message,
        data: "/Test",
      },
    };

    return admin.messaging().sendToTopic("test", payload);
  });
