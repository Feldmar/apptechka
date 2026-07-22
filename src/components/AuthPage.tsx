import { useState, type ChangeEvent, type FormEvent } from 'react'
import cn from 'classnames'
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
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
import { Visibility, VisibilityOff } from '@mui/icons-material'

type AuthMode = 'login' | 'register'

export function AuthPage() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [showPassword, setShowPassword] = useState(false);

  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
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
        await login({ email: email.trim(), password })
      } else {
        await register({ email: email.trim(), password })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка авторизации')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChangeEmail = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value.trim()

    setEmail(value)

    if (!value) {
      setEmailError('Введите email')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Некорректный email')
    } else {
      setEmailError('')
    }
  }

  const handleChangePassword = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value

    setPassword(value)

    if (!value) {
      setPasswordError('Введите пароль')
      return
    }

    if (value.length < 8) {
      setPasswordError('Минимум 8 символов')
      return
    }

    if (value.length > 28) {
      setPasswordError('Максимум 28 символов')
      return
    }

    if (!/[a-z]/.test(value)) {
      setPasswordError('Добавьте строчную букву')
      return
    }

    if (!/[A-Z]/.test(value)) {
      setPasswordError('Добавьте заглавную букву')
      return
    }

    if (!/\d/.test(value)) {
      setPasswordError('Добавьте цифру')
      return
    }

    if (!/[^A-Za-z\d]/.test(value)) {
      setPasswordError('Добавьте специальный символ')
      return
    }

    setPasswordError('')
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
            label="Email"
            type="email"
            value={email}
            onChange={handleChangeEmail}
            autoComplete="email"
            fullWidth
            required
            error={!!emailError}
            helperText={emailError}
          />

          <TextField
            label="Пароль"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handleChangePassword}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            fullWidth
            required
            error={!!passwordError}
            helperText={passwordError}
            className={styles.inputPassword}
            slotProps={{
              htmlInput: {
                minLength: 8,
                maxLength: 28,
              },
              input: {
                endAdornment: (
                  <InputAdornment position="end" className={cn(styles.toggleVisability)}>
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
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
