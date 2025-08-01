import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Spinner from './Spinner';
import { verifyToken } from '../services/authService';

const GuestRoute = () => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authData = await verifyToken();
        if (authData.isAuthenticated) {
          navigate('/settings');
        } else {
          setChecking(false);
        }
      } catch (err) {
        setChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (checking) return <Spinner />;

  return <Outlet />;
};

export default GuestRoute;