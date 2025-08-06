import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Spinner from './Spinner';

const ProtectedRoute = ({ requiredRole, optional = false }) => {
  const [authState, setAuthState] = useState({
    loading: true,
    isAuthenticated: false,
    role: null
  });

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
          const userData = JSON.parse(user);
          setAuthState({
            loading: false,
            isAuthenticated: true,
            role: userData.role
          });
          
          if (requiredRole && userData.role !== requiredRole) {
            navigate('/');
          }
        } else {
          // إذا كان المسار اختياري نسمح بالمرور
          if (optional) {
            setAuthState({
              loading: false,
              isAuthenticated: false,
              role: null
            });
          } else {
            navigate('/login');
          }
        }
      } catch (error) {
        // إذا كان المسار اختياري نسمح بالمرور حتى مع وجود خطأ
        if (optional) {
          setAuthState({
            loading: false,
            isAuthenticated: false,
            role: null
          });
        } else {
          navigate('/login');
        }
      }
    };

    checkAuth();
  }, [navigate, requiredRole, optional]);

  if (authState.loading) {
    return <Spinner />;
  }

  return <Outlet />;
};

export default ProtectedRoute;