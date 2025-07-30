import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Spinner from './Spinner';

const GuestRoute = () => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify`, {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
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