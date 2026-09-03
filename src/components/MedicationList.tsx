import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import MedicationIcon from '@mui/icons-material/Medication';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmergencyIcon from '@mui/icons-material/Emergency';
import type { Medication } from '../types';
import { useCountdown } from '../hooks/useCountdown';
import { formatTimeDisplay } from '../utils/time';
import styles from './MedicationList.module.scss';

interface MedicationItemProps {
  medication: Medication;
  onRemove: (id: string) => Promise<void>;
  onLogIntake: (id: string) => Promise<void>;
}

function MedicationItem({
  medication,
  onRemove,
  onLogIntake,
}: MedicationItemProps) {
  const countdown = useCountdown(medication.times);
  const [logging, setLogging] = useState(false);
  const [removing, setRemoving] = useState(false);

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
                  {index === 0 && countdown ? ` · ${countdown}` : ''}
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

interface MedicationListProps {
  medications: Medication[];
  title: string;
  emptyText: string;
  onRemove: (id: string) => Promise<void>;
  onLogIntake: (id: string) => Promise<void>;
}

export function MedicationList({
  medications,
  title,
  emptyText,
  onRemove,
  onLogIntake,
}: MedicationListProps) {
  return (
    <BoxSection title={title} count={medications.length}>
      {medications.length === 0 ? (
        <Paper className={styles.empty}>
          <MedicationIcon className={styles.emptyIcon} />
          <Typography className={styles.emptyText}>{emptyText}</Typography>
        </Paper>
      ) : (
        <List disablePadding className={styles.list}>
          {medications.map((medication) => (
            <ListItem
              key={medication.id}
              disablePadding
              className={styles.item}
            >
              <MedicationItem
                medication={medication}
                onRemove={onRemove}
                onLogIntake={onLogIntake}
              />
            </ListItem>
          ))}
        </List>
      )}
    </BoxSection>
  );
}

function BoxSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.section}>
      <Typography variant="h6" className={styles.sectionTitle}>
        {title}
        {count > 0 && (
          <Typography component="span" variant="body2" className={styles.count}>
            ({count})
          </Typography>
        )}
      </Typography>
      {children}
    </div>
  );
}
