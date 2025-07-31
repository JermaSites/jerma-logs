import type { FirebaseApp } from 'firebase/app'
import type { Firestore } from 'firebase/firestore'
import type { Functions } from 'firebase/functions'

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'

let app: FirebaseApp
let firestore: Firestore
let functions: Functions

export default function () {
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

  if (!app)
    app = initializeApp(firebaseConfig)

  if (!firestore)
    firestore = getFirestore(app)

  if (!functions)
    functions = getFunctions(app)

  return {
    app,
    firestore,
    functions,
  }
}
