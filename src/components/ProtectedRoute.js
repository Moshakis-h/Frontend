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
      const token = localStorage.getItem('token');
      
      if (!token) {
        setAuthState({
          loading: false,
          isAuthenticated: false,
          role: null
        });
        navigate('/login');
        return;
      }

      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setAuthState({
            loading: false,
            isAuthenticated: true,
            role: data.role
          });
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuthState({
            loading: false,
            isAuthenticated: false,
            role: null
          });
          navigate('/login');
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthState({
          loading: false,
          isAuthenticated: false,
          role: null
        });
        navigate('/login');
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