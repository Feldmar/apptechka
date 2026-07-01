import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { requireAuth } from '../middleware/auth.js'
import { getUserDb } from '../userDb.js'
import type { MedicationRow } from '../types.js'

const router = Router()

router.use(requireAuth)

function mapMedication(row: MedicationRow) {
  return {
    id: row.id,
    name: row.name,
    dosage: row.dosage,
    time: row.time,
    hasReminder: Boolean(row.has_reminder),
    lastNotifiedDate: row.last_notified_date,
    createdAt: row.created_at,
  }
}

router.get('/', (req, res) => {
  const db = getUserDb(req.user!.id)

  const rows = db
    .prepare(
      `SELECT * FROM medications ORDER BY has_reminder DESC, time ASC, name ASC`,
    )
    .all() as MedicationRow[]

  res.json(rows.map(mapMedication))
})

router.post('/', (req, res) => {
  const db = getUserDb(req.user!.id)
  const { name, dosage, time, hasReminder = true } = req.body as {
    name?: string
    dosage?: string
    time?: string | null
    hasReminder?: boolean
  }

  if (!name?.trim() || !dosage?.trim()) {
    res.status(400).json({ error: 'Название и дозировка обязательны' })
    return
  }

  if (hasReminder && !time) {
    res.status(400).json({ error: 'Укажите время для напоминания' })
    return
  }

  const id = uuidv4()
  const createdAt = new Date().toISOString()

  db.prepare(
    `INSERT INTO medications (id, name, dosage, time, has_reminder, last_notified_date, created_at)
     VALUES (?, ?, ?, ?, ?, NULL, ?)`,
  ).run(id, name.trim(), dosage.trim(), hasReminder ? time ?? null : null, hasReminder ? 1 : 0, createdAt)

  const row = db.prepare('SELECT * FROM medications WHERE id = ?').get(id) as MedicationRow
  res.status(201).json(mapMedication(row))
})

router.delete('/:id', (req, res) => {
  const db = getUserDb(req.user!.id)
  const result = db.prepare('DELETE FROM medications WHERE id = ?').run(req.params.id)

  if (result.changes === 0) {
    res.status(404).json({ error: 'Препарат не найден' })
    return
  }

  res.status(204).send()
})

router.patch('/:id/notified', (req, res) => {
  const db = getUserDb(req.user!.id)
  const { date } = req.body as { date?: string }

  if (!date) {
    res.status(400).json({ error: 'Дата обязательна' })
    return
  }

  const result = db
    .prepare('UPDATE medications SET last_notified_date = ? WHERE id = ?')
    .run(date, req.params.id)

  if (result.changes === 0) {
    res.status(404).json({ error: 'Препарат не найден' })
    return
  }

  const row = db
    .prepare('SELECT * FROM medications WHERE id = ?')
    .get(req.params.id) as MedicationRow

  res.json(mapMedication(row))
})

export default router
