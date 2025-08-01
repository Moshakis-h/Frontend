import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiEnvelope, BiLock } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import '../Style/Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('البريد الإلكتروني غير صالح');
      return false;
    }

    if (formData.password.length < 6) {
      setErrorMessage('كلمة المرور يجب أن تكون 6 أحرف أو أكثر');
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      console.log("Sending login request to:", `${API_BASE_URL}/api/auth/login`);
      console.log("Request data:", formData);
      
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Debug': 'true' // لأغراض التصحيح
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", res.status);
      
      const responseData = await res.json();
      console.log("Response data:", responseData);

      if (res.ok) {
        if (responseData.token) {
          localStorage.setItem('authToken', responseData.token);
          console.log("Token stored in localStorage:", responseData.token);
          
          setSuccessMessage('تم تسجيل الدخول بنجاح!');
          setTimeout(() => {
            if (responseData.user?.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/');
            }
          }, 1500);
        } else {
          throw new Error('Token is missing in response');
        }
      } else {
        setErrorMessage(responseData.message || 'معلومات التسجيل غير صحيحة');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'تعذر الاتصال بالخادم، حاول لاحقاً.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">  
      <div className="login-content">
        <h2>تسجيل الدخول</h2>
        
        {errorMessage && (
          <div className="error-messagee" style={{ display: 'block' }}>
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="success-message" style={{ display: 'block' }}>
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">البريد الإلكتروني</label>
          <div className="input-group">
            <BiEnvelope size={20} style={{ color: '#A67769', margin: '0 10px' }} />
            <input
              type="email"
              name="email"
              placeholder="أدخل بريدك الإلكتروني"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <label htmlFor="password">كلمة المرور</label>
          <div className="input-group">
            <BiLock size={20} style={{ color: '#A67769', margin: '0 10px' }} />
            <input
              type="password"
              name="password"
              placeholder="أدخل كلمة المرور"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit" 
            className="btn"
            disabled={isLoading}
          >
            {isLoading ? 'جاري المعالجة...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="links">
          <p><a href="#">نسيت كلمة المرور؟</a></p>
          <p>لا تملك حساب؟ <Link to="/register">تسجيل</Link></p>
        </div>
      </div>
    </div>  
  );
}

export default Login;