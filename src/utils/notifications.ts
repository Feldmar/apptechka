import type { Medication } from '../types'
import { getCurrentTimeString, getTodayDateString } from './time'

export function shouldNotify(medication: Medication): boolean {
  if (!medication.hasReminder || !medication.time) {
    return false
  }

  const today = getTodayDateString()
  const now = getCurrentTimeString()

  return medication.time === now && medication.lastNotifiedDate !== today
}

export function markNotified(medication: Medication): Medication {
  return {
    ...medication,
    lastNotifiedDate: getTodayDateString(),
  }
}

export function showMedicationNotification(medication: Medication): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return
  }

  new Notification('Время принять лекарство', {
    body: `${medication.name} — ${medication.dosage}`,
    icon: '/favicon.svg',
    tag: medication.id,
  })
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied'
  }

  if (Notification.permission === 'granted') {
    return 'granted'
  }

  if (Notification.permission !== 'denied') {
    return Notification.requestPermission()
  }

  return Notification.permission
}
