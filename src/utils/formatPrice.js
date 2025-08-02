// src/utils/formatPrice.js
export const formatPrice = (price, currency) => {
  if (currency === 'د.ك') {
    return Number(price).toFixed(3);
  }
  return Number(price).toFixed(2);
};