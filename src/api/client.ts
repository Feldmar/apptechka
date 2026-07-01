import type {
  AuthResponse,
  CreateIntakeData,
  CreateMedicationData,
  Intake,
  LoginData,
  Medication,
  RegisterData,
  User,
} from '../types'
import { clearToken, getToken, setToken } from '../utils/authStorage'

const API_BASE = '/api'

type UnauthorizedHandler = () => void

let onUnauthorized: UnauthorizedHandler | null = null

export function setUnauthorizedHandler(handler: UnauthorizedHandler): void {
  onUnauthorized = handler
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> | undefined),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 401 && token) {
    clearToken()
    onUnauthorized?.()
  }

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
  register: (data: RegisterData) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: LoginData) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () => request<User>('/auth/me'),

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

export { setToken, clearToken, getToken }
