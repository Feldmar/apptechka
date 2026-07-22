import { useState } from 'react'
import cn from 'classnames'
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import type { MedicationFormData } from '../types'
import { TimeInput24 } from './TimeInput24'
import styles from './MedicationForm.module.scss'

interface MedicationFormProps {
  onAdd: (data: MedicationFormData) => Promise<void>
}

const initialForm: MedicationFormData = {
  name: '',
  dosage: '',
  multiplicity: 1,
  times: ['09:00'],
  hasReminder: true,
}

export function MedicationForm({ onAdd }: MedicationFormProps) {
  const [form, setForm] = useState<MedicationFormData>(initialForm)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!form.name.trim()) {
      setError('Введите название препарата')
      return
    }

    if (!form.dosage.trim()) {
      setError('Введите дозировку')
      return
    }

    if (
      form.hasReminder &&
      form.times.some((time) => !time)
    ) {
      setError('Укажите время каждого приема')
      return
    }

    try {
      setSubmitting(true)
      await onAdd(form)
      setForm({
        ...initialForm,
        times: form.times,
        hasReminder: form.hasReminder,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось добавить препарат')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={(event) => void handleSubmit(event)}
      className={cn(styles.form, { [styles.formWithError]: Boolean(error) })}
    >
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Название препарата"
        placeholder="Например, Аспирин"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        fullWidth
        required
      />

      <TextField
        label="Дозировка"
        placeholder="Например, 500 мг"
        value={form.dosage}
        onChange={(e) => setForm({ ...form, dosage: e.target.value })}
        fullWidth
        required
      />
      
      <TextField
        label="Кратность приема"
        type="number"
        value={form.multiplicity}
        onChange={(e) => {
          const multiplicity = Math.max(1, Number(e.target.value))

          setForm((prev) => ({
            ...prev,
            multiplicity,
            times: Array.from({ length: multiplicity }, (_, index) =>
              prev.times[index] ?? '09:00'
            ),
          }))
        }}
        fullWidth
        required
      />

      <FormControlLabel
        control={
          <Switch
            checked={!form.hasReminder}
            onChange={(e) =>
              setForm({ ...form, hasReminder: !e.target.checked })
            }
          />
        }
        label="Экстренный препарат (без напоминания)"
      />

      {form.hasReminder &&
        form.times.map((time, index) => (
          <TimeInput24
            key={index}
            value={time}
            onChange={(newTime) => {
              const times = [...form.times]
              times[index] = newTime

              setForm({
                ...form,
                times,
              })
            }}
          />
        ))}

      <Button
        type="submit"
        variant="contained"
        size="large"
        startIcon={<AddIcon />}
        className={styles.submitButton}
        disabled={submitting}
      >
        {form.hasReminder ? 'Добавить напоминание' : 'Добавить препарат'}
      </Button>
    </Box>
  )
}
