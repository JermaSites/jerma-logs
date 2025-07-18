import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export function getDayOfLatestMessage(sentAt: number): string {
  return dayjs.utc(sentAt).subtract(12, 'hour').valueOf().toString()
}
