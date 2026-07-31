export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

export type MonthName = typeof MONTH_NAMES[number]

/** 0-based index of a month name (case-insensitive), or -1 if it is not one. */
export function monthIndex(month: string): number {
  return MONTH_NAMES.findIndex(name => name.toLowerCase() === month.toLowerCase())
}

/**
 * UTC start/end timestamps (epoch ms, as strings) for a month.
 *
 * Built from the numeric month so the string is unambiguous ISO-8601. Passing a
 * month *name* to dayjs silently falls back to `new Date()`, which parses in
 * local time unless the `customParseFormat` plugin is loaded.
 */
export function monthBounds(year: string | number, month: string): { start: string, end: string } | null {
  const index = monthIndex(month)
  const parsedYear = Number(year)

  if (index === -1 || !Number.isInteger(parsedYear))
    return null

  const start = Date.UTC(parsedYear, index, 1)
  const end = Date.UTC(parsedYear, index + 1, 1) - 1

  return { start: start.toString(), end: end.toString() }
}
