import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

function getNextReminderDate(times: string[], dates: string[]): Date | null {
  if (times.length === 0) return null;

  const now = dayjs();
  const hasDates = dates.length > 0;
  const datesSet = new Set(dates);
  const sortedTimes = [...times].sort();

  // ищем ближайший валидный день - до 30 дней вперёд
  for (let dayOffset = 0; dayOffset <= 30; dayOffset += 1) {
    const day = now.add(dayOffset, 'day');
    const dateKey = day.format('YYYY-MM-DD');

    // если заданы конкретные даты - пропускаем те дни, которых в них нет
    if (hasDates && !datesSet.has(dateKey)) continue;

    for (const time of sortedTimes) {
      const [hours, minutes] = time.split(':').map(Number);
      const candidate = day
        .hour(hours)
        .minute(minutes)
        .second(0)
        .millisecond(0);

      if (candidate.isAfter(now)) {
        return candidate.toDate();
      }
    }
  }

  return null;
}

function formatRemaining(target: Date): string {
  const diffMs = target.getTime() - Date.now();

  if (diffMs <= 0) return 'Пора!';

  const totalMinutes = Math.floor(diffMs / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `через ${days} д ${hours} ч`;
  if (hours > 0) return `через ${hours} ч ${minutes} мин`;
  return `через ${minutes} мин`;
}

export function useCountdown(times: string[], dates: string[] = []) {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const next = getNextReminderDate(times, dates);
      setCountdown(next ? formatRemaining(next) : '');
    };

    updateCountdown();

    const intervalId = setInterval(updateCountdown, 30_000);
    return () => clearInterval(intervalId);
  }, [times, dates]);

  return countdown;
}
