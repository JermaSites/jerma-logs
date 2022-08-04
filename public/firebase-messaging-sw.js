importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBV9G06TKa-B6LF7fe63Z7QFbm8PJU7ad4",
  authDomain: "jerma-logs.firebaseapp.com",
  databaseURL: "https://jerma-logs.firebaseio.com",
  projectId: "jerma-logs",
  storageBucket: "jerma-logs.appspot.com",
  messagingSenderId: "123570718331",
  appId: "1:123570718331:web:f246438a6c717efd10c4de",
  measurementId: "G-R7QL1P3TGG",
});

const messaging = firebase.messaging();
