import { BiMap, BiInfoCircle, BiShieldAlt2 } from 'react-icons/bi';
import { MdOutlineLocalShipping } from 'react-icons/md';
import { PiTranslateFill } from 'react-icons/pi';
import { FaWhatsapp, FaInstagram, FaYoutube } from 'react-icons/fa';

import '../Style/More.css';

function More() {
  return (
    <div className="more-container">
    <section className="more-section" dir="rtl">
      <div className="more-header">
        <button className="close-button">×</button>
        <h2>المزيد</h2>
      </div>

      <ul className="more-list">
        <li>
          <MdOutlineLocalShipping size={22} color="#A67769" />
          <span>حالة الطلب</span>
        </li>
        <li>
          <BiMap size={22} color="#A67769" />
          <span>إتصل بنا</span>
        </li>
        <li>
          <BiInfoCircle size={22} color="#A67769" />
          <span>من نحن</span>
        </li>
        <li>
          <BiShieldAlt2 size={22} color="#A67769" />
          <span>سياسة الخصوصية</span>
        </li>
        <li>
          <PiTranslateFill size={22} color="#A67769" />
          <span>English</span>
        </li>
      </ul>

      <div className="social-icons">
        <FaWhatsapp size={26} color="#A67769" />
        <FaInstagram size={26} color="#A67769" />
        <FaYoutube size={26} color="#A67769" />
      </div>

<div className="store-buttons">
  <img
    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
    alt="App Store"
  />
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
    alt="Google Play"
  />
</div>

      <p className="support-text">بدعم من <strong>منصتي</strong></p>

      <div className="sponsor-logo">
        <img src="sponor.png" alt="Knet Logo" />
      </div>
    </section>
  </div>   
  );
}

export default More;