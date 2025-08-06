import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logoutUser } from '../services/authService';

function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    setLoading(true);
    setError('');
    try {
      await logoutUser();
      
      // حذف معلومات المستخدم من localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      navigate("/login");
    } catch (err) {
      setError('تعذر تسجيل الخروج');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '90vh',
      backgroundColor: '#f9f9f9',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '30px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        border: '1px solid #eee'
      }}>
        <div style={{
          marginBottom: '30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            border: `2px solid #A67769`
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="#A67769">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          
          <h2 style={{
            color: '#333',
            fontSize: '24px',
            margin: '0 0 10px 0',
            fontWeight: '600'
          }}>الإعدادات</h2>
          
          <div style={{
            backgroundColor: '#f9f5f3',
            padding: '12px',
            borderRadius: '6px',
            margin: '20px 0',
            border: '1px solid #e8d9d1',
            width: '100%',
            color: '#A67769',
            fontWeight: '500',
            fontSize: '15px'
          }}>
            <p style={{ margin: 0 }}>أنت مسجل دخول حالياً</p>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fdf4f4',
            color: '#c53030',
            padding: '12px',
            borderRadius: '6px',
            margin: '20px 0',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleLogout}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#d1c8c4' : '#A67769',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            width: '100%',
            cursor: loading ? 'not-allowed' : 'pointer',
            borderRadius: '6px',
            fontSize: '15px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'background-color 0.3s ease'
          }}
        >
          {loading ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-2-3.5h4v-1h-4v1zM12 6c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2z"/>
              </svg>
              جاري تسجيل الخروج...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
              </svg>
              تسجيل الخروج
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Settings;