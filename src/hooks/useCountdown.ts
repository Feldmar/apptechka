import { useEffect, useState } from 'react'
import { formatCountdown } from '../utils/time'

export function useCountdown(time: string | null) {
  const [countdown, setCountdown] = useState(() =>
    time ? formatCountdown(time) : '',
  )

  useEffect(() => {
    if (!time) {
      setCountdown('')
      return
    }

    setCountdown(formatCountdown(time))
    const interval = setInterval(() => {
      setCountdown(formatCountdown(time))
    }, 30_000)

    return () => clearInterval(interval)
  }, [time])

  return countdown
}
