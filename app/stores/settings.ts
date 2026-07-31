export const useSettingsStore = defineStore(
  'settings',
  () => {
    const messageNotifications = ref(false)
    const susNotifications = ref(false)
    const testNotifications = ref(false)
    const hideMessageTimestamps = ref(false)
    const colorModeValue = ref('light')
    const userTimezone = ref('America/New_York')

    const updateCookieExpiration = ref(false)

    function refreshCookieExpiration() {
      updateCookieExpiration.value = !updateCookieExpiration.value
    }

    return {
      messageNotifications,
      susNotifications,
      testNotifications,
      hideMessageTimestamps,
      userTimezone,
      colorModeValue,
      // Must be returned to count as store state — otherwise mutating it never
      // triggers persistence and the cookie's expiry is never extended.
      updateCookieExpiration,
      refreshCookieExpiration,
    }
  },
  { persist: true },
)
