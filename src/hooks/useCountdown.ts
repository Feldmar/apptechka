import { useEffect, useState } from "react";
import { formatCountdown } from "../utils/time";

export function useCountdown(times: string[]) {
  const getCountdown = () => {
    if (!times.length) return "";

    // Если formatCountdown уже умеет возвращать время до указанного момента,
    // выбираем ближайшее (предполагается, что times отсортированы).
    return formatCountdown(times[0]);
  };

  const [countdown, setCountdown] = useState(getCountdown);

  useEffect(() => {
    if (!times.length) {
      setCountdown("");
      return;
    }

    setCountdown(getCountdown());

    const interval = setInterval(() => {
      setCountdown(getCountdown());
    }, 30_000);

    return () => clearInterval(interval);
  }, [times]);

  return countdown;
}
