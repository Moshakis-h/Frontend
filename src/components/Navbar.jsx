import React from "react";
import { NavLink } from "react-router-dom";
import '../Style/Navbar.css'
import {
  BsJournalText,
  BsFileEarmarkCheck,
  BsBag,
  BsPersonCircle,
  BsGrid,
  BsImages // تم استيراد الأيقونة الجديدة
} from "react-icons/bs";

const navItems = [
  { to: "/", icon: <BsJournalText />, label: "القائمة" },
  { to: "/orders", icon: <BsFileEarmarkCheck />, label: "طلباتي" },
  { to: "/cart", icon: <BsBag />, label: "السلة" },
  // العنصر الجديد للمعرض
  { to: "/gallery", icon: <BsImages />, label: "المعرض" },
  { to: "/login", icon: <BsPersonCircle />, label: "تسجيل الدخول" },
  { to: "/more", icon: <BsGrid />, label: "المزيد" },
];

const Navbar = () => {
  return (
    <nav className="bottom-navbar">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          className={({ isActive }) =>
            "nav-item" + (isActive ? " active" : "")
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;