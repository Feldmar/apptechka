import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const TIME_FORMAT = 'HH:mm'

export function getTodayDateString(): string {
  return dayjs().format('YYYY-MM-DD')
}

export function getCurrentTimeString(): string {
  return dayjs().format(TIME_FORMAT)
}

export function normalizeTime(time: string): string {
  const parsed = dayjs(time, TIME_FORMAT, true)

  if (!parsed.isValid()) {
    return '09:00'
  }

  return parsed.format(TIME_FORMAT)
}

export function formatTimeDisplay(time: string): string {
  return normalizeTime(time)
}

export function parseTime(time: string): { hours: string; minutes: string } {
  const normalized = normalizeTime(time)
  const [hours, minutes] = normalized.split(':')

  return { hours, minutes }
}

export function buildTime(hours: string, minutes: string): string {
  return normalizeTime(`${hours}:${minutes}`)
}

export function getNextOccurrence(time: string): dayjs.Dayjs {
  const normalized = normalizeTime(time)
  const [hours, minutes] = normalized.split(':').map(Number)
  const now = dayjs()
  let next = now.hour(hours).minute(minutes).second(0).millisecond(0)

  if (next.isBefore(now) || next.isSame(now, 'minute')) {
    next = next.add(1, 'day')
  }

  return next
}

export function formatCountdown(time: string): string {
  const next = getNextOccurrence(time)
  const diffMinutes = next.diff(dayjs(), 'minute')

  if (diffMinutes < 1) return 'скоро'
  if (diffMinutes < 60) return `через ${diffMinutes} мин`

  const hours = Math.floor(diffMinutes / 60)
  const mins = diffMinutes % 60

  if (mins === 0) return `через ${hours} ч`
  return `через ${hours} ч ${mins} мин`
}

export function formatDate(date: string): string {
  return dayjs(date).format('D MMMM YYYY')
}

export function formatDateTime(value: string): string {
  return dayjs(value).format('D MMM YYYY, HH:mm')
}

export function formatMonthTitle(value: string): string {
  return dayjs(value).format('MMMM YYYY')
}
