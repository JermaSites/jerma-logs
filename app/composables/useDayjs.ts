export default function () {
  const { $dayjs } = useNuxtApp()

  return {
    dayjs: $dayjs,
  }
}
