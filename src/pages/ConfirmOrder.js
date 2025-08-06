import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiIdentification } from "react-icons/hi";
import { FaUser, FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Spinner from '../components/Spinner';
import '../Style/ConfirmOrder.css';

function ConfirmOrder() {
  const [userInfo, setUserInfo] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب إعدادات الموقع
        const settingsResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/public/settings`);
        if (!settingsResponse.ok) throw new Error('فشل في جلب إعدادات الموقع');
        const settingsData = await settingsResponse.json();
        setSiteSettings(settingsData);
        
        // جلب معلومات المستخدم من localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUserInfo(JSON.parse(storedUser));
        } else {
          // تحقق من وجود بيانات ضيف مخزنة مسبقاً
          const savedGuestInfo = localStorage.getItem('guestUserInfo');
          if (savedGuestInfo) {
            setGuestInfo(JSON.parse(savedGuestInfo));
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError('حدث خطأ أثناء جلب البيانات: ' + err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGuestChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContinue = () => {
    // إذا كان المستخدم غير مسجل، حفظ بياناته في localStorage
    if (!userInfo) {
      if (!guestInfo.name || !guestInfo.phone) {
        alert('الرجاء إدخال الاسم ورقم الهاتف');
        return;
      }
      localStorage.setItem('guestUserInfo', JSON.stringify(guestInfo));
    }
    
    navigate('/checkoutaddress');
  };

  if (loading) {
    return (
      <div className="confirm-order-container">
        <div className="header">
          <HiIdentification size={80} color="#A67769" />
          <h3>معلومات الإتصال</h3>
          <p>جاري تحميل بياناتك...</p>
        </div>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="confirm-order-container">
        <div className="header">
          <HiIdentification size={80} color="#A67769" />
          <h3>معلومات الإتصال</h3>
        </div>
        <div className="error-message">{error}</div>
        <button 
          className="continue-button"
          onClick={() => navigate('/')}
        >
          العودة للصفحة الرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="confirm-order-container">
      <div className="header">
        <HiIdentification size={80} color="#A67769" />
        <h3>معلومات الإتصال</h3>
        <p>سنستخدمها للتواصل معك بشأن الطلبات</p>
      </div>

      {userInfo ? (
        // حالة المستخدم المسجل
        <div className="user-info-card">
          <div className="info-block">
            <label className="info-label">الاسم الكامل</label>
            <div className="info-content">
              <FaUser className="info-icon" />
              <span className="info-value">{userInfo?.name || 'غير متوفر'}</span>
            </div>
          </div>

          <div className="info-block">
            <label className="info-label">رقم الهاتف</label>
            <div className="info-content">
              <FaPhone className="info-icon" />
              <span className="info-value">
                {userInfo?.phone || 'غير متوفر'} 
                {siteSettings?.countryCode && ` (${siteSettings.countryCode})`}
              </span>
            </div>
          </div>

          <div className="info-block">
            <label className="info-label">البريد الإلكتروني</label>
            <div className="info-content">
              <MdEmail className="info-icon" />
              <span className="info-value">{userInfo?.email || 'غير متوفر'}</span>
            </div>
          </div>
        </div>
      ) : (
        // حالة المستخدم غير المسجل - تصميم مطابق لحاويات المعلومات
        <div className="user-info-card">
          <div className="info-block">
            <label className="info-label">الاسم الكامل *</label>
            <div className="info-content">
              <FaUser className="info-icon" />
              <input
                type="text"
                name="name"
                value={guestInfo.name}
                onChange={handleGuestChange}
                placeholder="أدخل اسمك"
                required
                className="guest-input"
              />
            </div>
          </div>

          <div className="info-block">
            <label className="info-label">رقم الهاتف *</label>
            <div className="info-content">
              <FaPhone className="info-icon" />
              <input
                type="tel"
                name="phone"
                value={guestInfo.phone}
                onChange={handleGuestChange}
                placeholder="أدخل رقم هاتفك"
                required
                className="guest-input"
              />
            </div>
          </div>

          <div className="info-block">
            <label className="info-label">البريد الإلكتروني (اختياري)</label>
            <div className="info-content">
              <MdEmail className="info-icon" />
              <input
                type="email"
                name="email"
                value={guestInfo.email}
                onChange={handleGuestChange}
                placeholder="أدخل بريدك الإلكتروني"
                className="guest-input"
              />
            </div>
          </div>
        </div>
      )}

      <div className="button-container">
        <button 
          className="continue-button"
          onClick={handleContinue}
        >
          التالي
        </button>
      </div>
    </div>
  );
}

export default ConfirmOrder;