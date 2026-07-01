import type { CreateMedicationData, CreateIntakeData, Intake, Medication } from '../types'

const API_BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'Ошибка запроса'

    try {
      const data = (await response.json()) as { error?: string }
      message = data.error ?? message
    } catch {
      // ignore parse errors
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export const api = {
  getMedications: () => request<Medication[]>('/medications'),

  createMedication: (data: CreateMedicationData) =>
    request<Medication>('/medications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteMedication: (id: string) =>
    request<void>(`/medications/${id}`, { method: 'DELETE' }),

  markMedicationNotified: (id: string, date: string) =>
    request<Medication>(`/medications/${id}/notified`, {
      method: 'PATCH',
      body: JSON.stringify({ date }),
    }),

  getIntakes: (from?: string, to?: string) => {
    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    const query = params.toString()
    return request<Intake[]>(`/intakes${query ? `?${query}` : ''}`)
  },

  createIntake: (data: CreateIntakeData) =>
    request<Intake>('/intakes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteIntake: (id: string) =>
    request<void>(`/intakes/${id}`, { method: 'DELETE' }),
}
