import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Spinner from './Spinner';

const ProtectedRoute = ({ requiredRole }) => {
  const [authState, setAuthState] = useState({
    loading: true,
    isAuthenticated: false,
    role: null
  });

  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const timestamp = new Date().getTime();
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify?t=${timestamp}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        const hasTokenCookie = document.cookie.split(';').some(cookie => cookie.trim().startsWith('token='));
        
        if (res.ok && hasTokenCookie) {
          const data = await res.json();
          setAuthState({
            loading: false,
            isAuthenticated: true,
            role: data.role
          });
        } else {
          setAuthState({
            loading: false,
            isAuthenticated: false,
            role: null
          });
          setTimeout(() => navigate('/login'), 100);
        }
      } catch (error) {
        setAuthState({
          loading: false,
          isAuthenticated: false,
          role: null
        });
        setTimeout(() => navigate('/login'), 100);
      }
    };

    verifyAuth();
  }, [navigate]);

  if (authState.loading) return <Spinner />;

  if (!authState.isAuthenticated) return null;

  if (requiredRole && authState.role !== requiredRole) {
    navigate('/');
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;