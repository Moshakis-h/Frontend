import React from "react";
import logo from "../assets/logo.png"; 
import '../Style/Header.css';

const Header = () => {
  return (
    <div className="top-header">
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
      <div className="site-name">بوفيت رويال</div>
      <div className="lang-switch">EN</div>
    </div>
  );
};

export default Header;