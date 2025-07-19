import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'

export default defineNuxtPlugin(() => {
  const firebaseConfig = {
    apiKey: 'AIzaSyBV9G06TKa-B6LF7fe63Z7QFbm8PJU7ad4',
    authDomain: 'jerma-logs.firebaseapp.com',
    databaseURL: 'https://jerma-logs.firebaseio.com',
    projectId: 'jerma-logs',
    storageBucket: 'jerma-logs.appspot.com',
    messagingSenderId: '123570718331',
    appId: '1:123570718331:web:f246438a6c717efd10c4de',
    measurementId: 'G-R7QL1P3TGG',
  }

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)

  // Initialize Firebase services
  const firestore = getFirestore(app)
  const functions = getFunctions(app)

  return {
    provide: {
      firebase: {
        app,
        firestore,
        functions,
      },
    },
  }
})
