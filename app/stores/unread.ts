export const useUnreadStore = defineStore(
  'unread',
  () => {
    const { dayjs } = useDayjs()

    const latestMessageIndex = ref<string>('')
    const dateOfLatestMessage = ref<string>('')
    const dateOfLastReadMessage = ref<string>('')

    const unreadMessages = computed(() => {
      const latestTimestamp = Number.parseInt(dateOfLatestMessage.value)
      const lastReadTimestamp = Number.parseInt(dateOfLastReadMessage.value)

      return dayjs(latestTimestamp).isAfter(dayjs(lastReadTimestamp))
    })

    return {
      unreadMessages,
      latestMessageIndex,
      dateOfLatestMessage,
      dateOfLastReadMessage,
    }
  },
  { persist: true },
)
