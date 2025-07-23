import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'

dayjs.extend(utc)

export default function (sentAt: number): string {
  return dayjs.utc(sentAt).subtract(12, 'hour').valueOf().toString()
}
