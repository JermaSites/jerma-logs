export default defineNuxtRouteMiddleware(() => {
  // Change meaningless variable to update cookie expiration date
  const sortStore = useSortStore()
  const settingsStore = useSettingsStore()

  sortStore.updateCookieExperation = !sortStore.updateCookieExperation
  settingsStore.updateCookieExperation = !settingsStore.updateCookieExperation
})
