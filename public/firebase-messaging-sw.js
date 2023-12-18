// importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
// importScripts(
//   "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
// );

// firebase.initializeApp({
//   apiKey: "AIzaSyBV9G06TKa-B6LF7fe63Z7QFbm8PJU7ad4",
//   authDomain: "jerma-logs.firebaseapp.com",
//   databaseURL: "https://jerma-logs.firebaseio.com",
//   projectId: "jerma-logs",
//   storageBucket: "jerma-logs.appspot.com",
//   messagingSenderId: "123570718331",
//   appId: "1:123570718331:web:f246438a6c717efd10c4de",
//   measurementId: "G-R7QL1P3TGG",
// });

// const messaging = firebase.messaging();

import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";
import { onBackgroundMessage } from "firebase/messaging/sw";

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = initializeApp({
  apiKey: "AIzaSyBV9G06TKa-B6LF7fe63Z7QFbm8PJU7ad4",
  authDomain: "jerma-logs.firebaseapp.com",
  databaseURL: "https://jerma-logs.firebaseio.com",
  projectId: "jerma-logs",
  storageBucket: "jerma-logs.appspot.com",
  messagingSenderId: "123570718331",
  appId: "1:123570718331:web:f246438a6c717efd10c4de",
  measurementId: "G-R7QL1P3TGG",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
