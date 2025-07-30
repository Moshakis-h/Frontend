import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Style/PaymentMethod.css"

function PaymentMethod() {
  const [cart, setCart] = useState([]);
  const [currency, setCurrency] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [userIP, setUserIP] = useState('');
  const navigate = useNavigate();

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

  // دالة لتنسيق عنوان التوصيل
  const formatAddress = () => {
    if (!deliveryAddress) return 'لم يتم تحديد عنوان';
    
    const { type, piece, street, houseNumber, building, floor, apartmentNumber, officeNumber, avenue, additional } = deliveryAddress;
    
    let address = `قطعة ${piece}, شارع ${street}`;
    
    if (type === 'home') {
      address += `, منزل ${houseNumber}`;
    } 
    else if (type === 'apartment') {
      address += `, بناية ${building}, طابق ${floor}, شقة ${apartmentNumber}`;
    } 
    else if (type === 'office') {
      address += `, بناية ${building}, طابق ${floor}, مكتب ${officeNumber}`;
    }
    
    if (avenue) address += `, جادة ${avenue}`;
    if (additional) address += `, ${additional}`;
    
    return address;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب IP المستخدم
        await fetchUserIP();
        
        // جلب إعدادات الموقع والعملة
        const apiUrl = process.env.REACT_APP_API_BASE_URL;
        if (!apiUrl) {
          throw new Error('REACT_APP_API_BASE_URL غير معرّف');
        }
        
        const settingsRes = await fetch(`${apiUrl}/api/public/settings`);
        const settingsData = await settingsRes.json();
        setSiteSettings(settingsData);
        if (settingsData.currency) {
          setCurrency(settingsData.currency);
          
          // تحديد طريقة الدفع الافتراضية حسب العملة
          setSelectedPayment(settingsData.currency === 'دك' ? 'wallet' : 'card');
        }

        // جلب معلومات المستخدم المسجل
        const userRes = await fetch(`${apiUrl}/api/auth/verify`, {
          method: 'GET',
          credentials: 'include'
        });
        
        if (!userRes.ok) throw new Error('فشل في جلب معلومات المستخدم');
        const userData = await userRes.json();
        
        if (userData.isAuthenticated) {
          setUserInfo(userData.user);
        } else {
          setError('يجب تسجيل الدخول أولاً');
        }

        // جلب محتوى السلة من localStorage
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
        
        // جلب بيانات العنوان من localStorage
        const savedAddress = localStorage.getItem('deliveryAddress');
        if (savedAddress) {
          setDeliveryAddress(JSON.parse(savedAddress));
        }
        
        setLoading(false);
      } catch (err) {
        setError('حدث خطأ أثناء جلب البيانات: ' + err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // حساب المجموع الكلي
  const totalAll = cart.reduce((sum, item) => sum + item.total, 0);

  const handleConfirmOrder = async () => {
    if (!selectedPayment) {
      alert('يرجى اختيار طريقة الدفع');
      return;
    }

    try {
      // استخدام متغير البيئة
      const apiUrl = process.env.REACT_APP_API_BASE_URL;
      if (!apiUrl) {
        throw new Error('REACT_APP_API_BASE_URL غير معرّف');
      }
      
      // إرسال بيانات الطلب إلى الباكند
      const response = await fetch(`${apiUrl}/api/payment/submit-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          totalAmount: totalAll,
          currency: currency,
          userIP: userIP,
          paymentMethod: selectedPayment
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // حفظ بيانات الطلب في localStorage
        localStorage.setItem('orderTotal', totalAll);
        localStorage.setItem('orderCurrency', currency);
        
        // التوجيه حسب طريقة الدفع
        if (selectedPayment === 'wallet') {
          navigate('/payment'); // طريقة كي نت
        } else {
          navigate('/paymentcard'); // بطاقة بنكية
        }
      } else {
        alert('فشل في تأكيد الطلب: ' + result.message);
      }
    } catch (err) {
      console.error('خطأ في تأكيد الطلب:', err);
      alert('حدث خطأ أثناء تأكيد الطلب');
    }
  };

  if (loading) {
    return (
      <div className="payment-loading">
        <div className="spinner"></div>
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-error">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/login')} className="login-btn">تسجيل الدخول</button>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-content">
        {/* تفاصيل الطلب */}
        <div className="payment-section">
          <p className="section-title">
            طريقة الدفع
          </p>
          
          <div className="payment-options">
            {currency === 'دك' && (
              <div
                className={`payment-option ${selectedPayment === 'wallet' ? 'selected' : ''}`}
                onClick={() => setSelectedPayment('wallet')}
              >
                <i className="fas fa-money-bill-wave"></i>
                <img src="sponor.png" alt="كي نت" />
                <p>كي نت</p>
              </div>
            )}
            
            <div
                className={`payment-option ${selectedPayment === 'card' ? 'selected' : ''}`}
                onClick={() => setSelectedPayment('card')}
              >
                <i className="fas fa-credit-card"></i>
                <img src="images/creditCard.png" alt="بطاقة بنكية" />
                <p>بطاقة بنكية</p>
              </div>
          </div>
        </div>       
        
        <div className="order-section">
          <p className="section-title">
            عناصر الطلب
          </p>
          
          {cart.length === 0 ? (
            <p className="empty-order">لا توجد عناصر في الطلب</p>
          ) : (
            <div className="order-items">
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-header">
                    <span className="item-name">
                      <span className="quantity">
                        <p>× {item.quantity}</p>
                        <span>{item.title}</span>               
                      </span>
                    </span>
                    <span className="item-price">
                      {currency} {item.basePrice.toFixed(3)}
                    </span>
                  </div>
                  
                  {item.extras.length > 0 && (
                    <div className="item-extras">
                      {item.extras.map((extra, i) => (
                        <div key={i} className="extra-item">
                          <span>{extra.name}</span>
                          <span className="extra-price">
                            {currency} {extra.price.toFixed(3)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* معلومات المستخدم */}
        <div className="user-section">
          <h2 className="section-title">
            <i className="fas fa-user"></i>
            معلومات التوصيل
          </h2>
          
          {userInfo ? (
            <div className="user-info">
              <div className="info-row">
                <span className="info-labell">الاسم:</span>
                <span className="info-valuee">{userInfo.name}</span>
              </div>
              <div className="info-row">
                <span className="info-labell">الهاتف:</span>
                <span className="info-valuee">{userInfo.phone}</span>
              </div>
              <div className="info-row">
                <span className="info-labell">العنوان:</span>
                <span className="info-valuee">
                  {formatAddress()}
                </span>
              </div>
            </div>
          ) : (
            <p className="no-user">لا تتوفر معلومات المستخدم</p>
          )}
          
          {cart.length > 0 && (
            <div className="order-total">
              <span>المجموع الكلي:</span>
              <span className="total-price">
                {currency} {totalAll.toFixed(3)}
              </span>
            </div>
          )}         
        </div>
        
        {/* أزرار التحكم */}
        <div className="payment-actions">
          <button className="confirm-action" onClick={handleConfirmOrder}>تأكيد الطلب</button>
        </div>
      </div>
    </div>
  );
}

export default PaymentMethod;