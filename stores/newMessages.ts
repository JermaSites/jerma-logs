const dayjs = useDayjs()

export const useMessageStore = defineStore(
  'newMessages',
  () => {
    const dateOfLatestMessage = ref<string>('')
    const dateOfLastReadMessage = ref<string>('')

    const unreadMessages = computed(() => {
      return dayjs(Number.parseInt(dateOfLatestMessage.value)).isAfter(dayjs(Number.parseInt(dateOfLastReadMessage.value)))
    })

    return {
      unreadMessages,
      dateOfLatestMessage,
      dateOfLastReadMessage,
    }
  },
  { persist: true },
)
