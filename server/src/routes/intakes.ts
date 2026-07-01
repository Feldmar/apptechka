import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { requireAuth } from '../middleware/auth.js'
import { getUserDb } from '../userDb.js'
import type { IntakeWithMedication } from '../types.js'

const router = Router()

router.use(requireAuth)

function mapIntake(row: IntakeWithMedication) {
  return {
    id: row.id,
    medicationId: row.medication_id,
    medicationName: row.medication_name,
    dosage: row.dosage,
    hasReminder: Boolean(row.has_reminder),
    takenAt: row.taken_at,
    note: row.note,
  }
}

router.get('/', (req, res) => {
  const db = getUserDb(req.user!.id)
  const { from, to } = req.query as { from?: string; to?: string }

  let query = `
    SELECT
      i.id,
      i.medication_id,
      i.taken_at,
      i.note,
      m.name AS medication_name,
      m.dosage,
      m.has_reminder
    FROM intakes i
    JOIN medications m ON m.id = i.medication_id
  `
  const params: string[] = []

  if (from && to) {
    query += ` WHERE date(i.taken_at) BETWEEN date(?) AND date(?)`
    params.push(from, to)
  } else if (from) {
    query += ` WHERE date(i.taken_at) >= date(?)`
    params.push(from)
  } else if (to) {
    query += ` WHERE date(i.taken_at) <= date(?)`
    params.push(to)
  }

  query += ` ORDER BY i.taken_at DESC`

  const rows = db.prepare(query).all(...params) as IntakeWithMedication[]
  res.json(rows.map(mapIntake))
})

router.post('/', (req, res) => {
  const db = getUserDb(req.user!.id)
  const { medicationId, takenAt, note } = req.body as {
    medicationId?: string
    takenAt?: string
    note?: string | null
  }

  if (!medicationId) {
    res.status(400).json({ error: 'medicationId обязателен' })
    return
  }

  const medication = db
    .prepare('SELECT id FROM medications WHERE id = ?')
    .get(medicationId)

  if (!medication) {
    res.status(404).json({ error: 'Препарат не найден' })
    return
  }

  const id = uuidv4()
  const takenAtValue = takenAt ?? new Date().toISOString()

  db.prepare(
    `INSERT INTO intakes (id, medication_id, taken_at, note) VALUES (?, ?, ?, ?)`,
  ).run(id, medicationId, takenAtValue, note?.trim() || null)

  const row = db
    .prepare(
      `SELECT
        i.id,
        i.medication_id,
        i.taken_at,
        i.note,
        m.name AS medication_name,
        m.dosage,
        m.has_reminder
      FROM intakes i
      JOIN medications m ON m.id = i.medication_id
      WHERE i.id = ?`,
    )
    .get(id) as IntakeWithMedication

  res.status(201).json(mapIntake(row))
})

router.delete('/:id', (req, res) => {
  const db = getUserDb(req.user!.id)
  const result = db.prepare('DELETE FROM intakes WHERE id = ?').run(req.params.id)

  if (result.changes === 0) {
    res.status(404).json({ error: 'Запись не найдена' })
    return
  }

  res.status(204).send()
})

export default router
