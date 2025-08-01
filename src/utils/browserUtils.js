// src/utils/browserUtils.js
export const isSamsungBrowser = () => {
  return /samsungbrowser/i.test(navigator.userAgent);
};

export const isProblematicBrowser = () => {
  return /samsungbrowser|opera mini|ucbrowser/i.test(navigator.userAgent);
};