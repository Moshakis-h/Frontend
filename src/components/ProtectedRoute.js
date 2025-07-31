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
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify`, {
          method: 'GET',
          credentials: 'include'
        });

        if (res.ok) {
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
          navigate('/login');
        }
      } catch (error) {
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

  if (!authState.isAuthenticated) return null; // تم التوجيه في useEffect

  if (requiredRole && authState.role !== requiredRole) {
    navigate('/');
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
