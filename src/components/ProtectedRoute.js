import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Spinner from './Spinner';

const ProtectedRoute = ({ requiredRole }) => {
  const [authState, setAuthState] = useState({
    loading: true,
    isAuthenticated: false,
    role: null,
    user: null
  });

  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      // إذا لم يوجد توكن، توجيه فوري للدخول
      if (!token || !userData) {
        navigate('/login');
        return;
      }
      
      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          const data = await res.json();
          
          if (data.isAuthenticated) {
            setAuthState({
              loading: false,
              isAuthenticated: true,
              role: data.role,
              user: data.user
            });
          } else {
            // إذا كانت الجلسة غير صالحة، نمسح التخزين المحلي
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }
        } else {
          // إذا فشل التحقق، نمسح التخزين المحلي
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    verifyAuth();
  }, [navigate]);

  if (authState.loading) {
    return <Spinner />;
  }

  if (!authState.isAuthenticated) {
    return null; // تم التوجيه إلى /login في useEffect
  }

  if (requiredRole && authState.role !== requiredRole) {
    navigate('/');
    return null;
  }

  return <Outlet context={{ user: authState.user }} />;
};

export default ProtectedRoute;