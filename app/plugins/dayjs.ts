import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

export default defineNuxtPlugin(() => {
  dayjs.extend(advancedFormat)
  dayjs.extend(relativeTime)
  dayjs.extend(timezone)
  dayjs.extend(utc)

  if (import.meta.client) {
    const settingsStore = useSettingsStore()
    const { userTimezone } = storeToRefs(settingsStore)

    dayjs.tz.setDefault(userTimezone.value)
    watch(userTimezone, tz => dayjs.tz.setDefault(tz))
  }

  return {
    provide: {
      dayjs,
    },
  }
})
