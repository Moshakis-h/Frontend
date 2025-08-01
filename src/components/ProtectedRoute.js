import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Spinner from './Spinner';
import { verifyToken } from '../services/authService';

const ProtectedRoute = ({ requiredRole }) => {
  const [authState, setAuthState] = useState({
    loading: true,
    isAuthenticated: false,
    role: null
  });

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authData = await verifyToken();
        
        if (authData.isAuthenticated) {
          setAuthState({
            loading: false,
            isAuthenticated: true,
            role: authData.role
          });
          
          if (requiredRole && authData.role !== requiredRole) {
            navigate('/');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, requiredRole]);

  if (authState.loading) {
    return <Spinner />;
  }

  return <Outlet />;
};

export default ProtectedRoute;