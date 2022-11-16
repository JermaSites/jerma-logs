import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBV9G06TKa-B6LF7fe63Z7QFbm8PJU7ad4",
  authDomain: "jerma-logs.firebaseapp.com",
  databaseURL: "https://jerma-logs.firebaseio.com",
  projectId: "jerma-logs",
  storageBucket: "jerma-logs.appspot.com",
  messagingSenderId: "123570718331",
  appId: "1:123570718331:web:f246438a6c717efd10c4de",
  measurementId: "G-R7QL1P3TGG",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

let messaging;
isSupported().then((supported) => {
  if (supported) {
    messaging = getMessaging(app);

    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      // ...
    });
  }
});

export { db, messaging };
