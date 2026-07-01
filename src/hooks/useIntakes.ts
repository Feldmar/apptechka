import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Intake } from '../types'

export function useIntakes(from?: string, to?: string) {
  const [intakes, setIntakes] = useState<Intake[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadIntakes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getIntakes(from, to)
      setIntakes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить историю')
    } finally {
      setLoading(false)
    }
  }, [from, to])

  useEffect(() => {
    void loadIntakes()
  }, [loadIntakes])

  const removeIntake = useCallback(async (id: string) => {
    await api.deleteIntake(id)
    setIntakes((prev) => prev.filter((intake) => intake.id !== id))
  }, [])

  return { intakes, loading, error, reload: loadIntakes, removeIntake }
}
