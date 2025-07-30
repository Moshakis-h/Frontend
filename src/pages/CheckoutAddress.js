// src/components/CheckoutAddress.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaBuilding, FaBriefcase, FaUmbrellaBeach } from 'react-icons/fa';
import '../Style/CheckoutAddress.css';

function CheckoutAddress() {
  const navigate = useNavigate();
  const [addressType, setAddressType] = useState('home');
  const [formData, setFormData] = useState({
    piece: '',
    street: '',
    houseNumber: '',
    building: '',
    floor: '',
    apartmentNumber: '',
    officeNumber: '',
    avenue: '',
    additional: '',
    chaletNumber: '',
    resortName: '',
    blockNumber: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.piece) newErrors.piece = true;
    if (!formData.street) newErrors.street = true;

    if (addressType === 'home') {
      if (!formData.houseNumber) newErrors.houseNumber = true;
    } else if (addressType === 'apartment') {
      if (!formData.building) newErrors.building = true;
      if (!formData.floor) newErrors.floor = true;
      if (!formData.apartmentNumber) newErrors.apartmentNumber = true;
    } else if (addressType === 'office') {
      if (!formData.building) newErrors.building = true;
      if (!formData.floor) newErrors.floor = true;
      if (!formData.officeNumber) newErrors.officeNumber = true;
    } else if (addressType === 'chalet') {
      if (!formData.chaletNumber) newErrors.chaletNumber = true;
      if (!formData.resortName) newErrors.resortName = true;
      if (!formData.blockNumber) newErrors.blockNumber = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // احفظ بيانات العنوان في localStorage
      const addressData = {
        type: addressType,
        ...formData
      };
      localStorage.setItem('deliveryAddress', JSON.stringify(addressData));
      
      navigate('/paymentmethod');
    }
  };

  return (
    <div className="checkout-container">
      <div className="header">
        <h1>عنوان التسليم</h1>
        <p>الموقع الدقيق سيساعدك على الوصول إليك بشكل أسرع</p>
      </div>

      <div className="address-section">
        <h2>الأندلس</h2>

        <div className="address-type-selector">
          <button
            className={`type-btn ${addressType === 'home' ? 'active' : ''}`}
            onClick={() => setAddressType('home')}
          >
            <FaHome className="icon" />
            <span>منزل</span>
          </button>

          <button
            className={`type-btn ${addressType === 'apartment' ? 'active' : ''}`}
            onClick={() => setAddressType('apartment')}
          >
            <FaBuilding className="icon" />
            <span>شقة</span>
          </button>

          <button
            className={`type-btn ${addressType === 'office' ? 'active' : ''}`}
            onClick={() => setAddressType('office')}
          >
            <FaBriefcase className="icon" />
            <span>مكتب</span>
          </button>
          
          <button
            className={`type-btn ${addressType === 'chalet' ? 'active' : ''}`}
            onClick={() => setAddressType('chalet')}
          >
            <FaUmbrellaBeach className="icon" />
            <span>شاليه</span>
          </button>
        </div>

        <div className="address-form">
          <div className="form-row">
            <div className={`form-group ${errors.piece ? 'error' : ''}`}>
              <label>قطعة</label>
              <input
                type="text"
                name="piece"
                value={formData.piece}
                onChange={handleInputChange}
                placeholder="رقم القطعة"
              />
            </div>

            <div className={`form-group ${errors.street ? 'error' : ''}`}>
              <label>شارع</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="اسم الشارع"
              />
            </div>
          </div>

          {addressType === 'home' && (
            <div className="form-row">
              <div className={`form-group ${errors.houseNumber ? 'error' : ''}`}>
                <label>منزل</label>
                <input
                  type="text"
                  name="houseNumber"
                  value={formData.houseNumber}
                  onChange={handleInputChange}
                  placeholder="رقم المنزل"
                />
              </div>

              <div className="form-group optional">
                <label>جادة</label>
                <input
                  type="text"
                  name="avenue"
                  value={formData.avenue}
                  onChange={handleInputChange}
                  placeholder="اسم الجادة"
                />
              </div>
            </div>
          )}

          {(addressType === 'apartment' || addressType === 'office') && (
            <>
              <div className="form-row">
                <div className={`form-group ${errors.building ? 'error' : ''}`}>
                  <label>البناية</label>
                  <input
                    type="text"
                    name="building"
                    value={formData.building}
                    onChange={handleInputChange}
                    placeholder="رقم البناية"
                  />
                </div>

                <div className={`form-group ${errors.floor ? 'error' : ''}`}>
                  <label>الطابق</label>
                  <input
                    type="text"
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    placeholder="رقم الطابق"
                  />
                </div>
              </div>

              <div className="form-row">
                {addressType === 'apartment' && (
                  <div className={`form-group ${errors.apartmentNumber ? 'error' : ''}`}>
                    <label>شقة رقم</label>
                    <input
                      type="text"
                      name="apartmentNumber"
                      value={formData.apartmentNumber}
                      onChange={handleInputChange}
                      placeholder="رقم الشقة"
                    />
                  </div>
                )}

                {addressType === 'office' && (
                  <div className={`form-group ${errors.officeNumber ? 'error' : ''}`}>
                    <label>مكتب رقم</label>
                    <input
                      type="text"
                      name="officeNumber"
                      value={formData.officeNumber}
                      onChange={handleInputChange}
                      placeholder="رقم المكتب"
                    />
                  </div>
                )}

                <div className="form-group optional">
                  <label>جادة</label>
                  <input
                    type="text"
                    name="avenue"
                    value={formData.avenue}
                    onChange={handleInputChange}
                    placeholder="اسم الجادة"
                  />
                </div>
              </div>
            </>
          )}
          
          {addressType === 'chalet' && (
            <>
              <div className="form-row">
                <div className={`form-group ${errors.chaletNumber ? 'error' : ''}`}>
                  <label>رقم الشاليه</label>
                  <input
                    type="text"
                    name="chaletNumber"
                    value={formData.chaletNumber}
                    onChange={handleInputChange}
                    placeholder="رقم الشاليه"
                  />
                </div>
                
                <div className={`form-group ${errors.resortName ? 'error' : ''}`}>
                  <label>اسم المنتجع</label>
                  <input
                    type="text"
                    name="resortName"
                    value={formData.resortName}
                    onChange={handleInputChange}
                    placeholder="اسم المنتجع"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className={`form-group ${errors.blockNumber ? 'error' : ''}`}>
                  <label>رقم البلوك</label>
                  <input
                    type="text"
                    name="blockNumber"
                    value={formData.blockNumber}
                    onChange={handleInputChange}
                    placeholder="رقم البلوك"
                  />
                </div>
                
                <div className="form-group optional">
                  <label>جادة</label>
                  <input
                    type="text"
                    name="avenue"
                    value={formData.avenue}
                    onChange={handleInputChange}
                    placeholder="اسم الجادة"
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group optional">
            <label>وصف إضافي</label>
            <textarea
              name="additional"
              value={formData.additional}
              onChange={handleInputChange}
              placeholder="أدخل وصف إضافي"
            />
          </div>
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          التالي
        </button>
      </div>
    </div>
  );
}

export default CheckoutAddress;