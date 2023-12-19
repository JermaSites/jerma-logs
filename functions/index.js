const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

exports.subscribeToMessageNotification = functions.firestore
  .document("/messageSubscribers/{documentId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();

    const { token } = data;

    return admin.messaging().subscribeToTopic(token, "message");
  });

exports.unsubscribeFromMessageNotification = functions.firestore
  .document("/messageSubscribers/{documentId}")
  .onDelete(async (snap, context) => {
    const data = snap.data();

    const { token } = data;

    return admin.messaging().unsubscribeFromTopic(token, "message");
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

exports.subscribeToSusNotification = functions.firestore
  .document("/susSubscribers/{documentId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();

    const { token } = data;

    return admin.messaging().subscribeToTopic(token, "sus");
  });

exports.unsubscribeFromSusNotification = functions.firestore
  .document("/susSubscribers/{documentId}")
  .onDelete(async (snap, context) => {
    const data = snap.data();

    const { token } = data;

    return admin.messaging().unsubscribeFromTopic(token, "sus");
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
        clickAction: `https://logs.jerma.io/`,
      },
    };

    return admin.messaging().sendToTopic("sus", payload);
  });

exports.subscribeToTestNotification = functions.firestore
  .document("/testSubscribers/{documentId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();

    const { token } = data;

    return admin.messaging().subscribeToTopic(token, "test");
  });

exports.unsubscribeFromTestNotification = functions.firestore
  .document("/testSubscribers/{documentId}")
  .onDelete(async (snap, context) => {
    const data = snap.data();

    const { token } = data;

    return admin.messaging().unsubscribeFromTopic(token, "test");
  });

exports.sendTestNotification = functions.firestore
  .document("/test/{documentId}")
  .onWrite(async (change, context) => {
    const messsageData = change.after.data();
    if (messsageData.name !== "test") return;

    // Notification details.
    const payload = {
      notification: {
        tag: "test",
        title: "Test Message",
        body: messsageData.message,
        icon: "https://logs.jerma.io/logo.png",
        clickAction: "/Latest",
      },
    };

    return admin.messaging().sendToTopic("test", payload);
  });
