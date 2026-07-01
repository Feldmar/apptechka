import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { buildTime, parseTime } from '../utils/time'
import styles from './TimeInput24.module.scss'

const HOURS = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'))

interface TimeInput24Props {
  value: string
  onChange: (value: string) => void
  label?: string
}

export function TimeInput24({ value, onChange, label = 'Время приёма' }: TimeInput24Props) {
  const { hours, minutes } = parseTime(value)

  const handleHoursChange = (event: SelectChangeEvent) => {
    onChange(buildTime(event.target.value, minutes))
  }

  const handleMinutesChange = (event: SelectChangeEvent) => {
    onChange(buildTime(hours, event.target.value))
  }

  return (
    <div className={styles.root}>
      <Typography variant="body2" className={styles.label}>
        {label}
      </Typography>

      <Stack direction="row" spacing={1} className={styles.fields}>
        <FormControl fullWidth required>
          <InputLabel id="time-hours-label">Часы</InputLabel>
          <Select
            labelId="time-hours-label"
            label="Часы"
            value={hours}
            onChange={handleHoursChange}
          >
            {HOURS.map((hour) => (
              <MenuItem key={hour} value={hour}>
                {hour}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography className={styles.separator} aria-hidden="true">
          :
        </Typography>

        <FormControl fullWidth required>
          <InputLabel id="time-minutes-label">Минуты</InputLabel>
          <Select
            labelId="time-minutes-label"
            label="Минуты"
            value={minutes}
            onChange={handleMinutesChange}
          >
            {MINUTES.map((minute) => (
              <MenuItem key={minute} value={minute}>
                {minute}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </div>
  )
}
