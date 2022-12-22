const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

exports.sendNotification = functions.firestore
  .document("/messages/{documentId}")
  .onCreate(async (snap, context) => {
    const querySnapshot = await admin
      .firestore()
      .collection("subscribers")
      .get();

    const messsageData = snap.data();
    if (messsageData.username !== "jerma985") return;

    const tokens = [];
    querySnapshot.forEach((doc) => {
      const { token } = doc.data();
      tokens.push(token);
    });

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

    return admin.messaging().sendToDevice(tokens, payload);
  });

exports.sendTestNotification = functions.firestore
  .document("/test/{documentId}")
  .onWrite(async (change, context) => {
    const messsageData = change.after.data();
    if (messsageData.name !== "test") return;

    const tokens = messsageData.tokens;

    // Notification details.
    const payload = {
      notification: {
        tag: "jerma",
        title: "Test Message",
        body: messsageData.message,
        icon: "https://logs.jerma.io/logo.png",
        click_action: `https://logs.jerma.io/Latest`,
      },
    };

    return admin.messaging().sendToDevice(tokens, payload);
  });
