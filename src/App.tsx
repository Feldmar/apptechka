import { useMemo, useState } from 'react'
import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy'
import LogoutIcon from '@mui/icons-material/Logout'
import MedicationIcon from '@mui/icons-material/Medication'
import { CalendarView } from './components/CalendarView'
import { MedicationForm } from './components/MedicationForm'
import { MedicationList } from './components/MedicationList'
import { NotificationBanner } from './components/NotificationBanner'
import { useAuth } from './contexts/AuthContext'
import { useNotificationPermission } from './hooks/useNotificationPermission'
import { useReminders } from './hooks/useReminders'
import styles from './App.module.scss'

type TabKey = 'medications' | 'calendar'

export default function App() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState<TabKey>('medications')
  const {
    medications,
    loading,
    error,
    addMedication,
    removeMedication,
    logIntake,
  } = useReminders()
  const { permission, requestPermission, isSupported, isGranted } =
    useNotificationPermission()

  const scheduledMedications = useMemo(
    () => medications.filter((medication) => medication.hasReminder),
    [medications],
  )

  const asNeededMedications = useMemo(
    () => medications.filter((medication) => !medication.hasReminder),
    [medications],
  )

  const handleAdd = async (data: Parameters<typeof addMedication>[0]) => {
    if (data.hasReminder && !isGranted) {
      void requestPermission()
    }

    await addMedication(data)
  }

  return (
    <Box className={styles.root}>
      <AppBar position="static" elevation={0}>
        <Toolbar className={styles.toolbar}>
          <div className={styles.toolbarStart}>
            <LocalPharmacyIcon className={styles.headerIcon} />
            <div>
              <Typography variant="h6" component="h1" className={styles.title}>
                Аптечка
              </Typography>
              <Typography variant="caption" className={styles.email}>
                {user?.email}
              </Typography>
            </div>
          </div>

          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={logout}
            className={styles.logoutButton}
          >
            Выйти
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" className={styles.container}>
        <Tabs
          value={tab}
          onChange={(_event, value: TabKey) => setTab(value)}
          variant="fullWidth"
          className={styles.tabs}
        >
          <Tab
            value="medications"
            label="Препараты"
            icon={<MedicationIcon />}
            iconPosition="start"
          />
          <Tab
            value="calendar"
            label="Календарь"
            icon={<CalendarMonthIcon />}
            iconPosition="start"
          />
        </Tabs>

        {tab === 'medications' && (
          <div className={styles.stack}>
            <NotificationBanner
              isSupported={isSupported}
              isGranted={isGranted}
              permission={permission}
              onRequestPermission={() => void requestPermission()}
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Paper className={styles.card}>
              <Typography variant="h6" className={styles.cardTitle}>
                Новый препарат
              </Typography>
              <Typography variant="body2" className={styles.cardDescription}>
                Добавьте регулярное напоминание или экстренный препарат без
                уведомлений. Нажмите «Принял», чтобы записать приём в календарь.
              </Typography>
              <MedicationForm onAdd={handleAdd} />
            </Paper>

            {loading ? (
              <div className={styles.loader}>
                <CircularProgress />
              </div>
            ) : (
              <>
                <MedicationList
                  medications={scheduledMedications}
                  title="Напоминания"
                  emptyText="Пока нет напоминаний. Добавьте препарат с временем приёма."
                  onRemove={removeMedication}
                  onLogIntake={logIntake}
                />

                <MedicationList
                  medications={asNeededMedications}
                  title="Экстренные"
                  emptyText="Экстренных препаратов пока нет."
                  onRemove={removeMedication}
                  onLogIntake={logIntake}
                />
              </>
            )}
          </div>
        )}

        {tab === 'calendar' && <CalendarView />}
      </Container>
    </Box>
  )
}
