import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { CircularProgress, CssBaseline, ThemeProvider } from '@mui/material'
import App from './App'
import { AuthPage } from './components/AuthPage'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { setUnauthorizedHandler } from './api/client'
import { theme } from './theme'
import './styles/global.scss'

function AppGate() {
  const { user, loading, logout } = useAuth()

  useEffect(() => {
    setUnauthorizedHandler(logout)
  }, [logout])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return <App key={user.id} />
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <AppGate />
    </AuthProvider>
  </ThemeProvider>,
)
