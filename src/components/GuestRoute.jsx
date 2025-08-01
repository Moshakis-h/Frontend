import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Spinner from './Spinner';

const GuestRoute = () => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log("GuestRoute token from localStorage:", token);
    
    if (token) {
      console.log("Token found, redirecting to settings");
      navigate('/settings');
    } else {
      console.log("No token found, allowing guest access");
      setChecking(false);
    }
  }, [navigate]);

  if (checking) return <Spinner />;

  return <Outlet />;
};

export default GuestRoute;