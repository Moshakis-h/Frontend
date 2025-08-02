import React from 'react';
import { formatPrice } from '../utils/formatPrice'; // استيراد الدالة الجديدة

const ConfirmButton = ({ totalPrice, currency, handleConfirm }) => (
  <button 
    className="confirm-button" 
    onClick={handleConfirm}
  >
    أضف إلى طلبك {formatPrice(totalPrice, currency)} {currency}
  </button>
);

export default ConfirmButton;