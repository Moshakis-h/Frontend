import React from 'react';

const QuantityControl = ({ quantity, setQuantity }) => (
  <div className="product-quantity">
    <button 
      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
      className={`quantity-btn ${quantity > 0 ? 'active' : ''}`}
    >
      -
    </button>
    <span className="quantity-value">{quantity}</span>
    <button
      onClick={() => setQuantity(prev => prev + 1)}
      className={`quantity-btn ${quantity > 0 ? 'active' : ''}`}
    >
      +
    </button>
  </div>
);

export default QuantityControl;