import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Spinner from './Spinner';

const GuestRoute = () => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      navigate('/settings');
    } else {
      setChecking(false);
    }
  }, [navigate]);

  if (checking) return <Spinner />;

  return <Outlet />;
};

export default GuestRoute;