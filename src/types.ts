export interface Medication {
  id: string
  name: string
  dosage: string
  time: string | null
  hasReminder: boolean
  lastNotifiedDate: string | null
  createdAt: string
}

export interface CreateMedicationData {
  name: string
  dosage: string
  time: string | null
  hasReminder: boolean
}

export interface MedicationFormData {
  name: string
  dosage: string
  time: string
  hasReminder: boolean
}

export interface Intake {
  id: string
  medicationId: string
  medicationName: string
  dosage: string
  hasReminder: boolean
  takenAt: string
  note: string | null
}

export interface CreateIntakeData {
  medicationId: string
  takenAt?: string
  note?: string | null
}

export type { User, AuthResponse, LoginData, RegisterData } from './types/auth'
