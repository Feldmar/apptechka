import { useCallback, useState } from 'react';
import { requestNotificationPermission } from '../utils/notifications';

export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (!('Notification' in window)) return 'denied';
    return Notification.permission;
  });

  const requestPermission = useCallback(async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    return result;
  }, []);

  const isSupported = 'Notification' in window;
  const isGranted = permission === 'granted';

  return { permission, requestPermission, isSupported, isGranted };
}