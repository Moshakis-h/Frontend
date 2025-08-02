// src/utils/formatPrice.js
export const formatPrice = (price, currency) => {
  // تحويل السعر إلى رقم للتأكد من معالجته بشكل صحيح
  const numericPrice = Number(price);
  
  // إذا كانت العملة "د.ك" أو "دك" (للتأكد من تغطية جميع الاحتمالات)
  if (currency === 'د.ك' || currency === 'دك') {
    return numericPrice.toFixed(3);
  }
  
  // في جميع الحالات الأخرى عرض برقمين عشريين
  return numericPrice.toFixed(2);
};