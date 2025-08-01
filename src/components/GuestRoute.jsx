import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Spinner from './Spinner';

const GuestRoute = () => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    // إذا كان المستخدم مسجل دخول، توجيه إلى الإعدادات
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/settings');
        }
      } catch (e) {
        console.error("User data parsing error:", e);
        setChecking(false);
      }
    } else {
      setChecking(false);
    }
  }, [navigate]);

  if (checking) {
    return <Spinner />;
  }

  return <Outlet />;
};

export default GuestRoute;