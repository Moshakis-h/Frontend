// components/Spinner.jsx
import React from 'react';
import '../Style/Spinner.css';

function Spinner({ size = 50, message = "جاري التحميل..." }) {
  return (
    <div className="spinner-fullscreen-wrapper">
      <div
        className="spinner"
        style={{
          width: size,
          height: size,
          borderWidth: size / 8,
          borderColor: '#A67769 transparent #A67769 transparent',
        }}
      ></div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
}

export default Spinner;