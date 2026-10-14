import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MedicationForm } from '../MedicationForm/MedicationForm';
import type { MedicationFormData } from '../../types';
import { formatDate } from '../../utils/time';
import styles from './MedicationFormDialog.module.scss';

interface MedicationFormDialogProps {
  open: boolean;
  dates: string[];
  onClose: () => void;
  onAdd: (data: MedicationFormData) => Promise<void>;
}

export function MedicationFormDialog({
  open,
  dates,
  onClose,
  onAdd,
}: MedicationFormDialogProps) {
  const handleSubmit = async (data: MedicationFormData) => {
    await onAdd(data);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { className: styles.paper } }}
    >
      <DialogTitle className={styles.title}>
        <div>
          <Typography variant="h6" component="span">
            Новый препарат
          </Typography>
          {dates.length > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              className={styles.subtitle}
            >
              Выбрано дней: <strong>{dates.length}</strong>
            </Typography>
          )}
        </div>
        <IconButton aria-label="Закрыть" onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {dates.length > 0 && (
        <div className={styles.datesPreview}>
          {dates.map((date) => (
            <span key={date} className={styles.dateChip}>
              {formatDate(date)}
            </span>
          ))}
        </div>
      )}

      <DialogContent dividers>
        <MedicationForm onAdd={handleSubmit} initialDates={dates} />
      </DialogContent>
    </Dialog>
  );
}
