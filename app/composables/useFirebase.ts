export default function () {
  const { $app, $firestore, $functions } = useNuxtApp()

  return {
    app: $app,
    firestore: $firestore,
    functions: $functions,
  }
}
