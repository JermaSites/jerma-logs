export default defineNuxtRouteMiddleware(() => {
  // Re-write the persisted cookies to extend their expiry. This must run
  // synchronously here: the plugin's own $subscribe watcher fires on a later
  // tick, after the Nuxt context is gone on the server.
  useSortStore().$persist()
  useSettingsStore().$persist()
})
