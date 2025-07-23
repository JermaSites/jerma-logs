export default function () {
  const { $firebase } = useNuxtApp()

  return {
    app: $firebase.app,
    firestore: $firebase.firestore,
    functions: $firebase.functions,
  }
}
