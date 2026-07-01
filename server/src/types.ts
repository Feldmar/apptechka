export interface MedicationRow {
  id: string
  name: string
  dosage: string
  time: string | null
  has_reminder: number
  last_notified_date: string | null
  created_at: string
}

export interface IntakeRow {
  id: string
  medication_id: string
  taken_at: string
  note: string | null
}

export interface IntakeWithMedication extends IntakeRow {
  medication_name: string
  dosage: string
  has_reminder: number
}
