// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.2.4/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.4/firebase-messaging.js')

const firebaseConfig = {
  apiKey: 'AIzaSyBV9G06TKa-B6LF7fe63Z7QFbm8PJU7ad4',
  authDomain: 'jerma-logs.firebaseapp.com',
  databaseURL: 'https://jerma-logs.firebaseio.com',
  projectId: 'jerma-logs',
  storageBucket: 'jerma-logs.appspot.com',
  messagingSenderId: '123570718331',
  appId: '1:123570718331:web:f246438a6c717efd10c4de'
}
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp(firebaseConfig)

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()
