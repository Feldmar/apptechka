import { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
} from '@mui/material';
import { useCountdown } from '../../../hooks/useCountdown';
import type { Medication } from '../../../types';
import { formatDate, formatTimeDisplay } from '../../../utils/time';
import styles from './MedicationItem.module.scss';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmergencyIcon from '@mui/icons-material/Emergency';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import MedicationIcon from '@mui/icons-material/Medication';
interface MedicationItemProps {
  medication: Medication;
  onRemove: (id: string) => Promise<void>;
  onLogIntake: (id: string) => Promise<void>;
}
export function MedicationItem({
  medication,
  onRemove,
  onLogIntake,
}: MedicationItemProps) {
  const countdown = useCountdown(medication.times, medication.dates);
  const [logging, setLogging] = useState(false);
  const [removing, setRemoving] = useState(false);

  const hasDates = medication.dates.length > 0;

  const handleLogIntake = async () => {
    try {
      setLogging(true);
      await onLogIntake(medication.id);
    } finally {
      setLogging(false);
    }
  };

  const handleRemove = async () => {
    try {
      setRemoving(true);
      await onRemove(medication.id);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <Paper className={styles.card}>
      <div className={styles.row}>
        {medication.hasReminder ? (
          <MedicationIcon color="primary" className={styles.icon} />
        ) : (
          <EmergencyIcon color="secondary" className={styles.icon} />
        )}

        <Box className={styles.content}>
          {medication.hasReminder && hasDates && (
            <div className={styles.datesRow}>
              {medication.dates.map((date) => (
                <span key={date} className={styles.dateChip}>
                  {formatDate(date)}
                </span>
              ))}
            </div>
          )}

          <div className={styles.titleRow}>
            <Typography variant="subtitle1" className={styles.name}>
              {medication.name}
            </Typography>

            {!medication.hasReminder && (
              <Chip label="Экстренный" size="small" color="secondary" />
            )}
          </div>

          <Typography variant="body2" className={styles.dosage}>
            Дозировка: {medication.dosage}
          </Typography>

          {medication.hasReminder &&
            medication.times.length > 0 &&
            medication.times.map((time, index) => (
              <div key={time + index} className={styles.timeRow}>
                <AccessTimeIcon className={styles.timeIcon} />
                <Typography variant="body2" className={styles.timeText}>
                  {formatTimeDisplay(time)}
                  {index === 0 && countdown && ` · ${countdown}`}
                </Typography>
              </div>
            ))}
        </Box>

        <div className={styles.actions}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<CheckCircleOutlinedIcon />}
            onClick={() => void handleLogIntake()}
            disabled={logging}
          >
            Принял
          </Button>
          <IconButton
            aria-label="Удалить препарат"
            onClick={() => void handleRemove()}
            color="error"
            size="small"
            disabled={removing}
          >
            <DeleteOutlinedIcon />
          </IconButton>
        </div>
      </div>
    </Paper>
  );
}
