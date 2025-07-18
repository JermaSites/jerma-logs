"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = require("firebase-admin");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-functions/v2/firestore");
const https_1 = require("firebase-functions/v2/https");
(0, app_1.initializeApp)();
exports.subscribeToTopic = (0, https_1.onCall)((request) => {
    const { token, topic } = request.data;
    return (0, firebase_admin_1.messaging)().subscribeToTopic(token, topic);
});
exports.unsubscribeFromTopic = (0, https_1.onCall)((request) => {
    const { token, topic } = request.data;
    return (0, firebase_admin_1.messaging)().unsubscribeFromTopic(token, topic);
});
exports.sendMessageNotification = (0, firestore_1.onDocumentCreated)('/messages/{documentId}', async (event) => {
    if (!event.data)
        return;
    const { message, username } = event.data.data();
    if (username !== 'jerma985')
        return;
    // Notification details.
    const payload = {
        topic: 'message',
        webpush: {
            notification: {
                title: 'Jerma in Twitch chat',
                body: message,
                icon: '/logo.png',
                tag: 'message',
                renotify: false,
            },
            fcmOptions: {
                link: 'https://logs.jerma.io/latest',
            },
        },
    };
    return (0, firebase_admin_1.messaging)().send(payload);
});
exports.sendSusNotification = (0, firestore_1.onDocumentCreated)('/sus/{documentId}', async (event) => {
    if (!event.data)
        return;
    const { message, username, mod } = event.data.data();
    if (username !== 'jerma985' && !mod)
        return;
    const susRegExp = /^!(commands\s+edit|editcom)\s+(-cd=\d+\s+)?(!sus)\s(-cd=\d+\s)?(?<susMessage>.+)$/;
    const sus = message.match(susRegExp)?.groups?.susMessage;
    if (!sus)
        return;
    // Notification details.
    const payload = {
        topic: 'sus',
        webpush: {
            notification: {
                title: `${username} updated the SUS`,
                body: sus,
                icon: '/logo.png',
                tag: 'sus',
                renotify: false,
            },
            fcmOptions: {
                link: 'https://logs.jerma.io/',
            },
        },
    };
    return (0, firebase_admin_1.messaging)().send(payload);
});
exports.sendTestNotification = (0, firestore_1.onDocumentWritten)('/test/{documentId}', async (event) => {
    if (!event.data)
        return;
    const { message } = event.data.after.data();
    // Notification details.
    // https://firebase.google.com/docs/reference/admin/node/firebase-admin.messaging.webpushnotification.md#webpushnotification_interface
    const payload = {
        topic: 'test',
        webpush: {
            notification: {
                title: 'Test Message',
                body: message,
                icon: '/logo.png',
                tag: 'test',
                renotify: false,
            },
            fcmOptions: {
                link: 'https://logs.jerma.io/',
            },
        },
    };
    return (0, firebase_admin_1.messaging)().send(payload);
});
