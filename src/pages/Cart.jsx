import { useEffect, useState } from 'react';
import '../Style/Cart.css';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';

function Cart() {
  const [cart, setCart] = useState([]);
  const [currency, setCurrency] = useState('');
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const settingsRes = await fetch(`${API_BASE_URL}/api/public/settings`);
        const settingsData = await settingsRes.json();
        if (settingsData.currency) {
          setCurrency(settingsData.currency);
        }
      } catch (error) {
        console.error('فشل جلب العملة:', error);
      }
    };

    fetchCurrency();
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, [API_BASE_URL]);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    updateCart(updatedCart);
  };

  const updateQuantity = (id, change) => {
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + change;
        if (newQty < 1) return item;

        const extrasTotal = item.extras.reduce((sum, e) => sum + (e.price * e.quantity), 0);
        const newTotal = (item.basePrice + extrasTotal) * newQty;

        return {
          ...item,
          quantity: newQty,
          total: newTotal
        };
      }
      return item;
    });
    updateCart(updatedCart);
  };

  const totalAll = cart.reduce((sum, item) => sum + item.total, 0);

  const handleConfirmOrder = () => {
    navigate('/confirm-order');
  };

  return (
    <div className="cart-container">
      <div className="cart-content">
        <h2 className="section-title">عناصر الطلب</h2>

        {cart.length === 0 ? (
          <p className="empty">السلة فارغة</p>
        ) : (
          cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-header">
                <span className="price">
                  <p>{currency}</p>
                  <p>{formatPrice(item.basePrice, currency)}</p>
                </span>
                <span className="title">
                  <div className="tit">{item.title}</div> x
                  <div className="quen">{item.quantity}</div>
                </span>
              </div>

              <ul className="options-list">
                {item.extras.map((extra, i) => (
                  <li key={i}>
                    <span className="price">
                      <p>{currency}</p>
                      <p>{formatPrice(extra.price, currency)}</p>
                    </span>
                    {extra.name}
                  </li>
                ))}
              </ul>

              <div className="controls">
                <div className="btns">
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
                <div>
                  <button onClick={() => removeItem(item.id)} className="delete-btn">
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="cart-summary">
          <div className="totall">
            <div className="priceTotal">
              <p>{currency}</p>
              <p>{formatPrice(totalAll, currency)}</p>
            </div>
            <div>:المجموع </div>
          </div>
          <button className="confirm-btn" onClick={handleConfirmOrder}>تأكيد الطلب</button>
        </div>
      )}
    </div>
  );
}

export default Cart;