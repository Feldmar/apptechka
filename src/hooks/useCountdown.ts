import { useEffect, useState } from 'react';
import { formatCountdown } from '../utils/time';

export function useCountdown(times: string[]) {
  const [countdown, setCountdown] = useState(() => {
    if (!times.length) return '';
    return formatCountdown(times[0]);
  });

  useEffect(() => {
    // Функция для обновления теперь внутри эффекта
    const updateCountdown = () => {
      if (!times.length) {
        setCountdown('');
        return;
      }
      setCountdown(formatCountdown(times[0]));
    };

    // Обновляем сразу при изменении times
    updateCountdown();

    // И запускаем интервал для регулярного обновления
    const intervalId = setInterval(updateCountdown, 30_000);
    return () => clearInterval(intervalId);
  }, [times]); // Зависимость только от times

  return countdown;
}