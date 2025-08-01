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
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify`, {
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
          
          if (requiredRole && data.role !== requiredRole) {
            navigate('/');
          }
        } else {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      } catch (error) {
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    };

    verifyAuth();
  }, [navigate, requiredRole]);

  if (authState.loading) {
    return <Spinner />;
  }

  return <Outlet />;
};

export default ProtectedRoute;