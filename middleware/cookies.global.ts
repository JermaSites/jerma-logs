export default defineNuxtRouteMiddleware((to, from) => {
  // Change meaningless variable to update cookie expiration date
  const settingsStore = useSettingsStore();
  const sortStore = useSortStore();

  sortStore.updateCookieExperation = !sortStore.updateCookieExperation;
  settingsStore.updateCookieExperation = !settingsStore.updateCookieExperation;
});
