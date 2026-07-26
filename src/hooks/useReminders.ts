import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Medication, MedicationFormData } from '../types'
import { normalizeTime } from '../utils/time'
import {
  markNotified,
  shouldNotify,
  showMedicationNotification,
} from '../utils/notifications'

export function useReminders() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMedications = useCallback(async () => {
    try {
      setError(null)
      const data = await api.getMedications()
      setMedications(
        data.map((medication) => ({
          ...medication,
          times: medication.times.map(normalizeTime),
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить препараты')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadMedications()
  }, [loadMedications])

  const addMedication = useCallback(async (data: MedicationFormData) => {
    const created = await api.createMedication({
  name: data.name.trim(),
  dosage: data.dosage.trim(),
  times: data.hasReminder
    ? data.times.map(normalizeTime)
    : [],
  hasReminder: data.hasReminder,
})

    setMedications((prev) =>
      [...prev, created].sort((a, b) => {
        if (a.hasReminder !== b.hasReminder) {
          return Number(b.hasReminder) - Number(a.hasReminder);
        }

        const aTime = a.times[0];
        const bTime = b.times[0];

        if (aTime && bTime) return aTime.localeCompare(bTime);
        if (aTime) return -1;
        if (bTime) return 1;

        return a.name.localeCompare(b.name);
      }),
    );
  }, [])

  const removeMedication = useCallback(async (id: string) => {
    await api.deleteMedication(id)
    setMedications((prev) => prev.filter((medication) => medication.id !== id))
  }, [])

  const logIntake = useCallback(async (medicationId: string, note?: string) => {
    await api.createIntake({ medicationId, note })
  }, [])

  const checkReminders = useCallback(() => {
    setMedications((prev) => {
      const due = prev.filter((medication) => shouldNotify(medication))

      if (due.length === 0) {
        return prev
      }

      due.forEach((medication) => {
        showMedicationNotification(medication)
        void api.markMedicationNotified(medication.id, markNotified(medication).lastNotifiedDate!)
      })

      return prev.map((medication) =>
        shouldNotify(medication) ? markNotified(medication) : medication,
      )
    })
  }, [])

  useEffect(() => {
    checkReminders()
    const interval = setInterval(checkReminders, 15_000)
    return () => clearInterval(interval)
  }, [checkReminders])

  return {
    medications,
    loading,
    error,
    addMedication,
    removeMedication,
    logIntake,
    reload: loadMedications,
  }
}
