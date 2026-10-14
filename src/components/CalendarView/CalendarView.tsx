import { useMemo, useState } from 'react';
import cn from 'classnames';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import isoWeek from 'dayjs/plugin/isoWeek';
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useIntakes } from '../../hooks/useIntakes';
import type { Intake } from '../../types';
import { formatDate, formatDateTime, formatMonthTitle } from '../../utils/time';
import styles from './CalendarView.module.scss';

dayjs.extend(isoWeek);
dayjs.locale('ru');

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

type CalendarViewProps = {
  selectionMode?: boolean;
  onConfirmSelection?: (dates: string[]) => void;
  onCancelSelection?: () => void;
};

export function CalendarView({
  selectionMode = false,
  onConfirmSelection,
  onCancelSelection,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(() =>
    dayjs().startOf('month'),
  );
  const [selectedDate, setSelectedDate] = useState(() =>
    dayjs().format('YYYY-MM-DD'),
  );

  const [pickedDates, setPickedDates] = useState<Set<string>>(new Set());

  const from = currentMonth.startOf('month').format('YYYY-MM-DD');
  const to = currentMonth.endOf('month').format('YYYY-MM-DD');
  const { intakes, loading, error, removeIntake } = useIntakes(from, to);

  const intakesByDate = useMemo(() => {
    const map = new Map<string, Intake[]>();

    intakes.forEach((intake) => {
      const date = dayjs(intake.takenAt).format('YYYY-MM-DD');
      const existing = map.get(date) ?? [];
      map.set(date, [...existing, intake]);
    });

    return map;
  }, [intakes]);

  const calendarDays = useMemo(() => {
    const start = currentMonth.startOf('month').startOf('isoWeek');
    const end = currentMonth.endOf('month').endOf('isoWeek');
    const days: dayjs.Dayjs[] = [];
    let day = start;

    while (day.isBefore(end) || day.isSame(end, 'day')) {
      days.push(day);
      day = day.add(1, 'day');
    }

    return days;
  }, [currentMonth]);

  const selectedIntakes = intakesByDate.get(selectedDate) ?? [];

  const handleDayClick = (dateKey: string) => {
    if (selectionMode) {
      setPickedDates((prev) => {
        const next = new Set(prev);
        if (next.has(dateKey)) next.delete(dateKey);
        else next.add(dateKey);
        return next;
      });
      return;
    }
    setSelectedDate(dateKey);
  };

  const handleConfirm = () => {
    if (pickedDates.size === 0) return;
    const sorted = Array.from(pickedDates).sort();
    setPickedDates(new Set());
    onConfirmSelection?.(sorted);
  };

  const handleCancel = () => {
    setPickedDates(new Set());
    onCancelSelection?.();
  };

  return (
    <div className={styles.root}>
      <Paper className={styles.calendar}>
        <div className={styles.header}>
          <IconButton
            aria-label="Предыдущий месяц"
            onClick={() =>
              setCurrentMonth((month) => month.subtract(1, 'month'))
            }
          >
            <ChevronLeftIcon />
          </IconButton>

          <Typography variant="h6" className={styles.monthTitle}>
            {formatMonthTitle(currentMonth.format('YYYY-MM-DD'))}
          </Typography>

          <IconButton
            aria-label="Следующий месяц"
            onClick={() => setCurrentMonth((month) => month.add(1, 'month'))}
          >
            <ChevronRightIcon />
          </IconButton>
        </div>

        {selectionMode && (
          <Alert severity="info" className={styles.selectionHint}>
            Выберите дни для приёма препарата. Можно несколько. Нажмите
            «Сохранить», когда закончите.
          </Alert>
        )}

        <div className={styles.weekdays}>
          {WEEKDAYS.map((weekday) => (
            <span key={weekday} className={styles.weekday}>
              {weekday}
            </span>
          ))}
        </div>

        {loading ? (
          <div className={styles.loader}>
            <CircularProgress size={28} />
          </div>
        ) : (
          <div className={styles.grid}>
            {calendarDays.map((day) => {
              const dateKey = day.format('YYYY-MM-DD');
              const dayIntakes = intakesByDate.get(dateKey) ?? [];
              const isCurrentMonth = day.month() === currentMonth.month();
              const isSelected = dateKey === selectedDate;
              const isPicked = pickedDates.has(dateKey);
              const isToday = day.isSame(dayjs(), 'day');

              return (
                <button
                  key={dateKey}
                  type="button"
                  className={cn(styles.day, {
                    [styles.dayOutside]: !isCurrentMonth,
                    [styles.daySelected]: !selectionMode && isSelected,
                    [styles.dayPicked]: selectionMode && isPicked,
                    [styles.dayToday]: isToday,
                    [styles.dayWithIntakes]: dayIntakes.length > 0,
                  })}
                  onClick={() => handleDayClick(dateKey)}
                >
                  <span>{day.date()}</span>
                  {dayIntakes.length > 0 && (
                    <span className={styles.dot}>{dayIntakes.length}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {selectionMode && (
          <div className={styles.selectionBar}>
            <Typography variant="body2" color="text.secondary">
              Выбрано: <strong>{pickedDates.size}</strong>
            </Typography>
            <div className={styles.selectionActions}>
              <Button onClick={handleCancel}>Отмена</Button>
              <Button
                variant="contained"
                disabled={pickedDates.size === 0}
                onClick={handleConfirm}
              >
                Сохранить
              </Button>
            </div>
          </div>
        )}
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      {!selectionMode && (
        <Paper className={styles.details}>
          <Typography variant="h6" className={styles.detailsTitle}>
            Приёмы за {formatDate(selectedDate)}
          </Typography>

          {selectedIntakes.length === 0 ? (
            <Typography color="text.secondary">
              В этот день приёмов не зафиксировано.
            </Typography>
          ) : (
            <ul className={styles.intakeList}>
              {selectedIntakes.map((intake) => (
                <li key={intake.id} className={styles.intakeItem}>
                  <div>
                    <Typography className={styles.intakeName}>
                      {intake.medicationName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {intake.dosage} · {formatDateTime(intake.takenAt)}
                      {!intake.hasReminder && ' · экстренный'}
                    </Typography>
                    {intake.note && (
                      <Typography variant="body2" className={styles.intakeNote}>
                        {intake.note}
                      </Typography>
                    )}
                  </div>

                  <IconButton
                    aria-label="Удалить запись о приёме"
                    size="small"
                    color="error"
                    onClick={() => void removeIntake(intake.id)}
                  >
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
                </li>
              ))}
            </ul>
          )}
        </Paper>
      )}
    </div>
  );
}
