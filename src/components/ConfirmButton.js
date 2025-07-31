import React from 'react';

const ConfirmButton = ({ totalPrice, currency, handleConfirm }) => (
  <button 
    className="confirm-button" 
    onClick={handleConfirm}
  >
    أضف إلى طلبك {totalPrice} {currency}
  </button>
);

export default ConfirmButton;