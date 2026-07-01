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
  time: '09:00',
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

    if (form.hasReminder && !form.time) {
      setError('Укажите время приёма')
      return
    }

    try {
      setSubmitting(true)
      await onAdd(form)
      setForm({ ...initialForm, time: form.time, hasReminder: form.hasReminder })
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

      {form.hasReminder && (
        <TimeInput24
          value={form.time}
          onChange={(time) => setForm({ ...form, time })}
        />
      )}

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
