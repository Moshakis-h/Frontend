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
        const token = localStorage.getItem('authToken');
        console.log("ProtectedRoute token from localStorage:", token);
        
        if (!token) {
          console.log("No token found, redirecting to login");
          navigate('/login');
          return;
        }

        console.log("Sending verification request with token:", token);
        
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Debug': 'true' // لأغراض التصحيح
          }
        });

        console.log("Verification response status:", res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log("Verification data:", data);
          
          setAuthState({
            loading: false,
            isAuthenticated: true,
            role: data.role
          });
          
          if (requiredRole && data.role !== requiredRole) {
            console.log(`User role (${data.role}) doesn't match required role (${requiredRole}), redirecting to home`);
            navigate('/');
          }
        } else {
          console.log("Token verification failed, removing token and redirecting to login");
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      } catch (error) {
        console.error('Verification error:', error);
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    };

    verifyAuth();
  }, [navigate, requiredRole]);

  if (authState.loading) {
    return <Spinner />;
  }

  return <Outlet />;
};

export default ProtectedRoute;