const dayjs = useDayjs()

export const useUnreadStore = defineStore(
  'unread',
  () => {
    const latestMessageIndex = ref<string>('')
    const dateOfLatestMessage = ref<string>('')
    const dateOfLastReadMessage = ref<string>('')

    const unreadMessages = computed(() => {
      return dayjs(Number.parseInt(dateOfLatestMessage.value)).isAfter(dayjs(Number.parseInt(dateOfLastReadMessage.value)))
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
