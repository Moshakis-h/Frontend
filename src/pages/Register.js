import { useState, useEffect } from 'react';
import { BiEnvelope, BiLock, BiUser, BiMap, BiPhone } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import '../Style/Register.css';

function Register() {
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const getCountryCode = (countryName) => {
    switch (countryName) {
      case 'الكويت':
        return '+965';
      case 'الإمارات':
        return '+971';
      case 'قطر':
        return '+974';
      case 'السعودية':
        return '+966';
      default:
        return '+965';
    }
  };

  useEffect(() => {
    const loadCountrySettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/public/settings`);
        const data = await response.json();
        if (response.ok) {
          setCountry(data.country);
          const code = getCountryCode(data.country);
          setCountryCode(code);
        } else {
          setErrorMessage('فشل في تحميل إعدادات البلد');
        }
      } catch (err) {
        setErrorMessage('تعذر الاتصال بالسيرفر');
      }
    };

    loadCountrySettings();
  }, [API_BASE_URL]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      setErrorMessage('كلمة المرور يجب أن تكون 6 أحرف أو أكثر');
      return false;
    }

    if (formData.phone.length < 9 || formData.phone.length > 10) {
      setErrorMessage('رقم الهاتف يجب أن يكون بين 9 و 10 أرقام');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          country,
          countryCode,
          phone: `${countryCode}${formData.phone}`
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('تم إنشاء الحساب بنجاح!');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setErrorMessage(data.message || 'حدث خطأ أثناء التسجيل');
      }
    } catch (error) {
      setErrorMessage('فشل الاتصال بالخادم، حاول لاحقاً.');
    } finally {
      if (!successMessage) setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <h2>أنشئ حساب</h2>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="country">البلد</label>
          <div className="input-group">
            <BiMap style={{ color: '#A67769', margin: '0 10px' }} />
            <input type="text" name="country" value={country} readOnly />
          </div>

          <label htmlFor="phone">رقم الهاتف</label>
          <div className="input-group" style={{ gap: '1px' }}>
            <BiPhone style={{ color: '#A67769', margin: '0 10px' }} />
            <input
              type="text"
              name="phone"
              placeholder="أدخل رقم هاتفك"
              required
              value={formData.phone}
              onChange={handleChange}
              style={{ flex: 1 }}
            />
            <input
              type="text"
              value={countryCode}
              readOnly
              style={{
                width: '60px',
                textAlign: 'center',
                border: 'none',
                background: 'transparent',
                fontWeight: '600',
                userSelect: 'none',
              }}
            />
          </div>

          <label htmlFor="name">الاسم</label>
          <div className="input-group">
            <BiUser style={{ color: '#A67769', margin: '0 10px' }} />
            <input
              type="text"
              name="name"
              placeholder="أدخل اسمك"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <label htmlFor="email">البريد الإلكتروني</label>
          <div className="input-group">
            <BiEnvelope style={{ color: '#A67769', margin: '0 10px' }} />
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
            <BiLock style={{ color: '#A67769', margin: '0 10px' }} />
            <input
              type="password"
              name="password"
              placeholder="أدخل كلمة المرور"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? 'جاري التسجيل...' : 'تأكيد'}
          </button>
        </form>

        <div className="terms">بالتسجيل أنت توافق على الشروط والأحكام</div>
      </div>
    </div>
  );
}

export default Register;