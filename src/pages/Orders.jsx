import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // جلب الطلبات من localStorage فقط
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // ترتيب الطلبات من الأحدث إلى الأقدم
    const sortedOrders = storedOrders.sort((a, b) => 
      b.timestamp - a.timestamp);
    
    setOrders(sortedOrders);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="orders-container">

      <div className="orders-list">

        {orders.length === 0 ? (
          <p className="no-orders">لا توجد طلبات سابقة</p>
        ) : (
          <ul>
            {orders.map((order, index) => (
              <li key={index} className="order-item">
                <div className="order-code">{order.code}</div>
                <div className="order-date">{order.date}</div>
                <div className="cancell">تم الإلغاء</div>
              </li>
            ))}
          </ul>
        )}
      </div>


    </div>
  );
};

export default Orders;