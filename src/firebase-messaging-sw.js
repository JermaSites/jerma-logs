// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.2.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.4/firebase-messaging.js");
import { precacheAndRoute } from "workbox-precaching";

const firebaseConfig = {
  apiKey: "AIzaSyBV9G06TKa-B6LF7fe63Z7QFbm8PJU7ad4",
  authDomain: "jerma-logs.firebaseapp.com",
  databaseURL: "https://jerma-logs.firebaseio.com",
  projectId: "jerma-logs",
  storageBucket: "jerma-logs.appspot.com",
  messagingSenderId: "123570718331",
  appId: "1:123570718331:web:f246438a6c717efd10c4de",
};
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
if (firebase.messaging.isSupported()) {
  const messaging = firebase.messaging();

  // messaging.onBackgroundMessage((payload) => {
  //   console.log('[firebase-messaging-sw.js] Received background message ', payload)
  //   // Customize notification here
  //   const notificationTitle = 'Background Message Title'
  //   const notificationOptions = {
  //     body: 'Background Message body.'
  //   }

  //   self.registration.showNotification(notificationTitle,
  //     notificationOptions)
  // })
}

workbox.core.setCacheNameDetails({ prefix: "jerma-logs" });

self.addEventListener("message", (event) => {
  console.log("self message event (I don't know what this is?");
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
precacheAndRoute(self.__WB_MANIFEST);
