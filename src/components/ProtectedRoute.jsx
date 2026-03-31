import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return children;
}
