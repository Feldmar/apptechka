import { useState } from 'react'
import cn from 'classnames'
import {
  Alert,
  Box,
  Button,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useAuth } from '../contexts/AuthContext'
import styles from './AuthPage.module.scss'

type AuthMode = 'login' | 'register'

export function AuthPage() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!username.trim() || !password) {
      setError('Заполните все поля')
      return
    }

    if (mode === 'register' && password !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    try {
      setSubmitting(true)

      if (mode === 'login') {
        await login({ username: username.trim(), password })
      } else {
        await register({ username: username.trim(), password })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка авторизации')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box className={styles.root}>
      <Paper className={styles.card}>
        <div className={styles.header}>
          <LocalPharmacyIcon className={styles.logo} />
          <Typography variant="h5" className={styles.title}>
            Аптечка
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Войдите или создайте аккаунт — у каждого пользователя своя база
            препаратов.
          </Typography>
        </div>

        <Tabs
          value={mode}
          onChange={(_event, value: AuthMode) => {
            setMode(value)
            setError(null)
          }}
          variant="fullWidth"
          className={styles.tabs}
        >
          <Tab value="login" label="Вход" />
          <Tab value="register" label="Регистрация" />
        </Tabs>

        <Box
          component="form"
          onSubmit={(event) => void handleSubmit(event)}
          className={cn(styles.form, { [styles.formWithError]: Boolean(error) })}
        >
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            fullWidth
            required
          />

          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            fullWidth
            required
          />

          {mode === 'register' && (
            <TextField
              label="Подтверждение пароля"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              fullWidth
              required
            />
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={submitting}
            startIcon={mode === 'login' ? <LoginIcon /> : <PersonAddIcon />}
          >
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
