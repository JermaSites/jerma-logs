import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/messaging'

const firebaseConfig = {
  apiKey: 'AIzaSyBV9G06TKa-B6LF7fe63Z7QFbm8PJU7ad4',
  authDomain: 'jerma-logs.firebaseapp.com',
  databaseURL: 'https://jerma-logs.firebaseio.com',
  projectId: 'jerma-logs',
  storageBucket: 'jerma-logs.appspot.com',
  messagingSenderId: '123570718331',
  appId: '1:123570718331:web:f246438a6c717efd10c4de'
}

// Get a Firestore instance
export const db = firebase.initializeApp(firebaseConfig).firestore()

// Enable cache
firebase.firestore().enablePersistence()
  .catch(err => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.')
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support all of the features required to enable persistence')
    }
  })

export const messaging = firebase.messaging()

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { Timestamp, GeoPoint } = firebase.firestore
export { Timestamp, GeoPoint }
