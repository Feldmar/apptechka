import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e7d6f',
      light: '#4a9d8e',
      dark: '#1f5a50',
    },
    secondary: {
      main: '#e07a5f',
    },
    background: {
      default: '#f4f7f6',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        },
      },
    },
  },
})
