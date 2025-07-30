import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaImages } from 'react-icons/fa';

const OptionItem = ({ 
  section, 
  option, 
  selectedOptions, 
  optionQuantities,
  handleOptionSelect,
  handleOptionQuantityChange,
  handleDateChange,
  selectedDates,
  index,
  productTitle,
  currency
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const isSelected = selectedOptions[section.id]?.includes(option.name);
  const quantity = isSelected ? optionQuantities[`${section.id}-${option.name}`] || 1 : 0;

  // إذا كان الخيار هو حقل التاريخ
  if (option.isDatePicker) {
    const dateKey = `${section.id}-${option.name}`;
    const dateValue = selectedDates[dateKey] || '';
    
    return (
      <div className="option-item">
        <input
          type="date"
          value={dateValue}
          onChange={(e) => {
            const date = e.target.value;
            setSelectedDate(date);
            handleDateChange(section.id, option.name, date);
          }}
          required
          className="date-input"
          min={new Date().toISOString().split('T')[0]}
        />
        <div className="option-text">
          {option.name}
        </div>
      </div>
    );
  }

  return (
    <div className="option-item">
      <div className="option-text-container">
        <div className="option-text">
          {option.name}
          {option.price > 0 && (
            <span className="option-price"> 
              +{option.price}{currency}
            </span>
          )}
        </div>
        {section.id === 'heaterTypes' && (
          <Link 
            to={`/gallery/${encodeURIComponent(option.name)}`}
            className="gallery-link"
          >
            <FaImages className="gallery-icon" />
            عرض المعرض
          </Link>
        )}
      </div>
      
      {isSelected ? (
        <div className="quantity-controls">
          <button 
            onClick={() => handleOptionQuantityChange(section.id, option.name, -1)}
            className={`quantity-btn ${quantity > 0 ? 'active' : ''}`}
          >
            -
          </button>
          <span className="quantity-value">{quantity}</span>
          <button
            onClick={() => handleOptionQuantityChange(section.id, option.name, 1)}
            className={`quantity-btn ${quantity > 0 ? 'active' : ''}`}
          >
            +
          </button>
        </div>
      ) : (
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={false}
            onChange={() => handleOptionSelect(section.id, option.name, option.price, index)}
          />
          <span className="checkmark"></span>
        </label>
      )}
    </div>
  );
};

export default OptionItem;