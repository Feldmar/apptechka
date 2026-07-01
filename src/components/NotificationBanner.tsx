import cn from 'classnames'
import { Alert, Button, Typography } from '@mui/material'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff'
import styles from './NotificationBanner.module.scss'

interface NotificationBannerProps {
  isSupported: boolean
  isGranted: boolean
  permission: NotificationPermission
  onRequestPermission: () => void
}

type BannerSeverity = 'warning' | 'success' | 'error' | 'info'

function getBannerState({
  isSupported,
  isGranted,
  permission,
}: Pick<NotificationBannerProps, 'isSupported' | 'isGranted' | 'permission'>): {
  severity: BannerSeverity
  message: string
  showAction: boolean
} {
  if (!isSupported) {
    return {
      severity: 'warning',
      message: 'Ваш браузер не поддерживает уведомления. Напоминания работать не будут.',
      showAction: false,
    }
  }

  if (isGranted) {
    return {
      severity: 'success',
      message:
        'Уведомления включены. Напоминания придут в указанное время, даже если вкладка свёрнута.',
      showAction: false,
    }
  }

  if (permission === 'denied') {
    return {
      severity: 'error',
      message:
        'Уведомления заблокированы в настройках браузера. Разрешите их для этого сайта, чтобы получать напоминания.',
      showAction: false,
    }
  }

  return {
    severity: 'info',
    message: '',
    showAction: true,
  }
}

export function NotificationBanner({
  isSupported,
  isGranted,
  permission,
  onRequestPermission,
}: NotificationBannerProps) {
  const { severity, message, showAction } = getBannerState({
    isSupported,
    isGranted,
    permission,
  })

  const icon =
    severity === 'warning' || severity === 'error' ? (
      <NotificationsOffIcon />
    ) : (
      <NotificationsActiveIcon />
    )

  return (
    <Alert
      severity={severity}
      icon={icon}
      className={cn(styles.banner, styles[`banner_${severity}`])}
      action={
        showAction ? (
          <Button color="inherit" size="small" onClick={onRequestPermission}>
            Включить
          </Button>
        ) : undefined
      }
    >
      {showAction ? (
        <>
          <Typography variant="body2" className={styles.title}>
            Разрешите уведомления
          </Typography>
          <Typography variant="body2" className={styles.description}>
            Без этого приложение не сможет напомнить о приёме лекарства в нужное время.
          </Typography>
        </>
      ) : (
        message
      )}
    </Alert>
  )
}
