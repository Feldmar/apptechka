import { List, ListItem, Paper, Typography } from '@mui/material';
import MedicationIcon from '@mui/icons-material/Medication';
import styles from './MedicationList.module.scss';
import type { Medication } from '../../types';
import { MedicationItem } from './MedicationItem/MedicationItem';
import { BoxSection } from './BoxSection/BoxSection';

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
