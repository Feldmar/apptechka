import { Typography } from '@mui/material';

import styles from './BoxSection.module.scss';

export function BoxSection({
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
