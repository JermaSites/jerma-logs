import useDayjs from '~/composables/useDayjs'

const dayjs = useDayjs()

export function getDayOfLatestMessage(sentAt: number): string {
  return dayjs.utc(sentAt).subtract(12, 'hour').valueOf().toString()
}
