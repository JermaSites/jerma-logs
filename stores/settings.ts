export const useSettingsStore = defineStore(
  "settings",
  () => {
    const messageNotifications = ref(false);
    const susNotifications = ref(false);
    const testNotifications = ref(false);
    const hideMessageTimestamps = ref(false);
    const colorModeValue = ref("light");
    const userTimezone = ref("America/New_York");

    const updateCookieExperation = ref(false);

    return {
      messageNotifications,
      susNotifications,
      testNotifications,
      hideMessageTimestamps,
      userTimezone,
      colorModeValue,
      updateCookieExperation,
    };
  },
  { persist: true }
);
