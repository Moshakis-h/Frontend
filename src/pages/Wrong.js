import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/Success.css';
import Spinner from '../components/Spinner';

const Wrong = () => {
  const navigate = useNavigate();
  const [orderCode, setOrderCode] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const orderGenerated = useRef(false);

  const generateOrderCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomLetters = '';
    for (let i = 0; i < 4; i++) {
      randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    const randomNumbers = Math.floor(100000 + Math.random() * 900000);
    return `${randomLetters}-${randomNumbers}`;
  };

  const getCurrentDate = () => {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true 
    };
    return now.toLocaleDateString('ar-EG', options);
  };

  useEffect(() => {
    if (orderGenerated.current) return;
    orderGenerated.current = true;

    // بداية التحميل
    setIsLoading(true);
    
    // توليد وحفظ بيانات الطلب
    const newOrderCode = generateOrderCode();
    const newOrderDate = getCurrentDate();
    
    setOrderCode(newOrderCode);
    setOrderDate(newOrderDate);

    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const newOrder = {
      code: newOrderCode,
      date: newOrderDate,
      timestamp: new Date().getTime()
    };
    
    localStorage.setItem('orders', JSON.stringify([...storedOrders, newOrder]));
    
    // إخفاء الـ Spinner بعد انتهاء المهام أو بعد 4 ثواني كحد أقصى
    setTimeout(() => {
      setIsLoading(false);
    }, 4000);
  }, []);

  const handleBack = () => {
    navigate(-3);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="success-container">
      <div className="success-content">
        <div className="failure-message">فشل الإجراء!</div>
        <div className="order-code-display">
          <span>رمز الطلب</span>        
          <span className="span1">{orderCode}</span>
        </div>
      </div>

      <div className="success-footer">
        <button onClick={handleBack}>مراجعة طريقة الدفع</button>
      </div>
    </div>
  );
};

export default Wrong;