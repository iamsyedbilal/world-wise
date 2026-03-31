import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

export default function useAuth() {
  const auth = useContext(AuthContext);
  if (auth === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return auth;
}
