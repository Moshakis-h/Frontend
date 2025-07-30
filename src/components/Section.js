import React from 'react';
import OptionItem from './OptionItem';

const Section = ({ 
  section, 
  index, 
  sectionRefs, 
  selectedOptions, 
  optionQuantities,
  handleOptionSelect,
  handleOptionQuantityChange,
  handleDateChange,
  selectedDates,
  productTitle,
  currency
}) => {
  return (
    <div
      className="category-section"
      ref={el => sectionRefs.current[index] = el}
    >
      <h3>{section.title}</h3>
      {section.min > 0 && <p className="limits">الحد الأدنى: {section.min}، الحد الأقصى: {section.max}</p>}

      <div className="options-list">
        {section.options && section.options.length > 0 ? (
          section.options.map(option => (
            <OptionItem
              key={option.name}
              section={section}
              option={option}
              selectedOptions={selectedOptions}
              optionQuantities={optionQuantities}
              handleOptionSelect={handleOptionSelect}
              handleOptionQuantityChange={handleOptionQuantityChange}
              handleDateChange={handleDateChange}
              selectedDates={selectedDates}
              index={index}
              productTitle={productTitle}
              currency={currency}
            />
          ))
        ) : (
          <p className="no-options">لا توجد خيارات متاحة لهذا القسم</p>
        )}
      </div>
    </div>
  );
};

export default Section;