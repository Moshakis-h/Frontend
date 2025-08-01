import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Spinner from './Spinner';

const GuestRoute = () => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setChecking(false);
      return;
    }

    // إذا كان هناك توكن، تحقق من صحته
    const verifyToken = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          navigate('/settings');
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setChecking(false);
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setChecking(false);
      }
    };

    verifyToken();
  }, [navigate]);

  if (checking) return <Spinner />;

  return <Outlet />;
};

export default GuestRoute;