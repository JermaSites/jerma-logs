const admin = require("firebase-admin");
const functions = require("firebase-functions");

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
    const { message, username } = snap.data();

    if (username !== "jerma985") return;

    // Notification details.
    const payload = {
      notification: {
        tag: "jerma",
        title: "Jerma in Twitch chat",
        body: message,
        icon: "/logo.png",
        clickAction: "/Latest",
      },
    };

    return admin.messaging().sendToTopic("message", payload);
  });

exports.sendSusNotification = functions.firestore
  .document("/sus/{documentId}")
  .onCreate(async (snap, context) => {
    const { message, username, mod } = snap.data();

    if (username !== "jerma985" && !mod) return;

    // Notification details.
    const payload = {
      notification: {
        tag: "sus",
        title: "You cast SUS!",
        body: message,
        icon: "/logo.png",
        clickAction: "/",
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
      notification: {
        tag: "test",
        title: "Test Message",
        body: message,
        icon: "/logo.png",
        clickAction: "/Test",
      },
    };

    return admin.messaging().sendToTopic("test", payload);
  });
