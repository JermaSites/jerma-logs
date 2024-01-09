import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default defineNuxtRouteMiddleware((to, from) => {
  // Change meaningless variable to update cookie expiration date
  const sortStore = useSortStore();
  const settingsStore = useSettingsStore();

  settingsStore.userTimezone = dayjs.tz.guess();

  sortStore.updateCookieExperation = !sortStore.updateCookieExperation;
  settingsStore.updateCookieExperation = !settingsStore.updateCookieExperation;
});
