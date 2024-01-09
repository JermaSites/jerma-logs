export const useSettingsStore = defineStore(
  "settings",
  () => {
    const messageNotifications = ref(false);
    const susNotifications = ref(false);
    const testNotifications = ref(false);
    const hideMessageTimestamps = ref(false);
    const userTimezone = ref("");

    const updateCookieExperation = ref(false);

    return {
      messageNotifications,
      susNotifications,
      testNotifications,
      hideMessageTimestamps,
      userTimezone,
      updateCookieExperation,
    };
  },
  { persist: true }
);
