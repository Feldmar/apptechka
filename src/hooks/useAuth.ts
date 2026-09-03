import { useContext } from 'react';
import { type AuthContextValue } from '../contexts/AuthContext';
import { AuthContext } from '../contexts/contexts';

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
