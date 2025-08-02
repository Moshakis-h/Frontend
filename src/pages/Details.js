import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/Details.css';
import logo from "../assets/logo.png";
import { FaArrowRight } from 'react-icons/fa';
import Section from '../components/Section';
import QuantityControl from '../components/QuantityControl';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmButton from '../components/ConfirmButton';
import Spinner from '../components/Spinner';
import { getSections } from '../utils/sectionData';
import { formatPrice } from '../utils/formatPrice'; // استيراد الدالة الجديدة

function Details() {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [currency, setCurrency] = useState('د.ك');
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [optionQuantities, setOptionQuantities] = useState({});
  const [selectedDates, setSelectedDates] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState('');
  const [sections, setSections] = useState([]);
  const [loadingSections, setLoadingSections] = useState(true);
  const sectionRefs = useRef([]);
  const errorTimeout = useRef(null);
  const selectedOptionsRef = useRef({});

  const calculateTotal = useCallback(() => {
    if (!product) return 0;
    
    let sum = (parseFloat(product.price) || 0) * quantity;

    sections.forEach(section => {
      if (selectedOptions[section.id]) {
        selectedOptions[section.id].forEach(optionName => {
          const option = section.options.find(o => o.name === optionName);
          if (option && option.price) {
            const key = `${section.id}-${optionName}`;
            sum += option.price * (optionQuantities[key] || 1);
          }
        });
      }
    });

    setTotalPrice(sum);
    return sum;
  }, [product, quantity, selectedOptions, optionQuantities, sections]);

  useEffect(() => {
    const productData = JSON.parse(localStorage.getItem('selectedProduct'));
    const currencyValue = localStorage.getItem('currency') || 'د.ك';
    setProduct(productData);
    setCurrency(currencyValue);

    if (productData) {
      setTotalPrice(parseFloat(productData.price) || 0);
    }

    return () => {
      if (errorTimeout.current) clearTimeout(errorTimeout.current);
    };
  }, []);

  useEffect(() => {
    const fetchSections = async () => {
      if (product) {
        try {
          const fetchedSections = await getSections(product);
          setSections(fetchedSections);
          setLoadingSections(false);
        } catch (error) {
          console.error("فشل في جلب الأقسام:", error);
          setError("حدث خطأ أثناء تحميل خيارات المنتج. يرجى المحاولة مرة أخرى.");
          setLoadingSections(false);
        }
      }
    };

    if (product) {
      setLoadingSections(true);
      fetchSections();
    }
  }, [product]);

  useEffect(() => {
    selectedOptionsRef.current = selectedOptions;
  }, [selectedOptions]);

  useEffect(() => {
    if (product && sections.length > 0) {
      calculateTotal();
    }
  }, [quantity, selectedOptions, optionQuantities, calculateTotal, product, sections]);

  const handleOptionSelect = (sectionId, optionName, price, sectionIndex) => {
  setError('');
  setSelectedOptions(prev => {
    const newOptions = {...prev};
    const section = sections.find(s => s.id === sectionId);
    
    if (!newOptions[sectionId]) {
      newOptions[sectionId] = [];
    }
    
    const currentTotal = Object.keys(optionQuantities).reduce((sum, key) => {
      if (key.startsWith(sectionId)) {
        return sum + (optionQuantities[key] || 1);
      }
      return sum;
    }, 0);
    
    if (newOptions[sectionId].includes(optionName)) {
      newOptions[sectionId] = newOptions[sectionId].filter(o => o !== optionName);
      setOptionQuantities(prev => {
        const newQuantities = {...prev};
        delete newQuantities[`${sectionId}-${optionName}`];
        return newQuantities;
      });
    } else {
      if (currentTotal >= section.max) {
        setError(`لا يمكن اختيار أكثر من ${section.max} خيارات من قسم "${section.title}"`);
        return prev;
      }
      
      if (section.max === 1) {
        newOptions[sectionId] = [optionName];
      } else {
        newOptions[sectionId] = [...newOptions[sectionId], optionName];
      }
      
      setOptionQuantities(prev => ({
        ...prev,
        [`${sectionId}-${optionName}`]: 1
      }));
    }
    
    // حساب العدد الكلي للخيارات المحددة في القسم الحالي
    const totalSelectedInSection = newOptions[sectionId]?.length || 0;
    
    // التحقق مما إذا تم الوصول إلى الحد الأدنى قبل التمرير
    if (sectionIndex < sections.length - 1 && totalSelectedInSection >= section.min) {
      setTimeout(() => {
        const nextSection = sectionRefs.current[sectionIndex + 1];
        if (nextSection) {
          const yOffset = -100;
          const y = nextSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300);
    }
    
    return newOptions;
  });
};

  const handleOptionQuantityChange = (sectionId, optionName, change) => {
    setError('');
    setOptionQuantities(prev => {
      const key = `${sectionId}-${optionName}`;
      const current = prev[key] || 1;
      const section = sections.find(s => s.id === sectionId);
      
      let totalQuantities = Object.keys(prev).reduce((sum, qKey) => {
        if (qKey.startsWith(sectionId)) {
          return sum + (prev[qKey] || 0);
        }
        return sum;
      }, 0);
      
      const currentOptionQuantity = prev[key] || 1;
      totalQuantities -= currentOptionQuantity;
      
      let newQuantity = current + change;
      
      if (change > 0 && (totalQuantities + newQuantity) > section.max) {
        const available = section.max - totalQuantities;
        setError(`يمكنك اختيار ${available} فقط من قسم "${section.title}"`);
        newQuantity = current;
      }
      
      if (newQuantity < 1) {
        newQuantity = 0;
        
        setTimeout(() => {
          setSelectedOptions(prevOptions => {
            const newOptions = {...prevOptions};
            if (newOptions[sectionId]) {
              newOptions[sectionId] = newOptions[sectionId].filter(o => o !== optionName);
            }
            return newOptions;
          });
        }, 0);
      }
      
      const newQuantities = {
        ...prev,
        [key]: newQuantity
      };
      
      if (newQuantity === 0) {
        setTimeout(() => {
          delete newQuantities[key];
          return newQuantities;
        }, 0);
      }
      
      return newQuantities;
    });
  };

  const handleDateChange = (sectionId, optionName, date) => {
    setSelectedDates(prev => ({
      ...prev,
      [`${sectionId}-${optionName}`]: date
    }));
    
    const currentSelectedOptions = selectedOptionsRef.current;
    
    if (date) {
      if (!currentSelectedOptions[sectionId]?.includes(optionName)) {
        const sectionIndex = sections.findIndex(s => s.id === sectionId);
        if (sectionIndex >= 0) {
          handleOptionSelect(sectionId, optionName, 0, sectionIndex);
        }
      }
    } else {
      if (currentSelectedOptions[sectionId]?.includes(optionName)) {
        const sectionIndex = sections.findIndex(s => s.id === sectionId);
        if (sectionIndex >= 0) {
          handleOptionSelect(sectionId, optionName, 0, sectionIndex);
        }
      }
    }
  };

  const validateSelection = () => {
    setError('');
    let hasError = false;
    
    const deliveryDateSection = sections.find(s => s.id === 'deliveryDate');
    if (deliveryDateSection && deliveryDateSection.required) {
      const deliverySelected = selectedOptions['deliveryDate']?.length || 0;
      const deliveryDate = selectedDates[`deliveryDate-${deliveryDateSection.options[0]?.name}`];
      
      if (deliverySelected === 0 || !deliveryDate) {
        setError('يجب تحديد تاريخ التوصيل');
        hasError = true;
        
        const sectionIndex = sections.findIndex(s => s.id === 'deliveryDate');
        if (sectionIndex >= 0 && sectionRefs.current[sectionIndex]) {
          const element = sectionRefs.current[sectionIndex];
          const yOffset = -150;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
        return false;
      }
    }

    for (const section of sections) {
      if (section.id === 'deliveryDate') continue;
      
      if (section.required) {
        let totalSelected = 0;
        if (selectedOptions[section.id]) {
          selectedOptions[section.id].forEach(optionName => {
            const key = `${section.id}-${optionName}`;
            totalSelected += (optionQuantities[key] || 1);
          });
        }

        if (totalSelected < section.min) {
          const errorMsg = `يجب اختيار ${section.min} خيارات على الأقل من قسم "${section.title}"`;
          setError(errorMsg);
          hasError = true;
          
          const sectionIndex = sections.findIndex(s => s.id === section.id);
          if (sectionIndex >= 0 && sectionRefs.current[sectionIndex]) {
            const element = sectionRefs.current[sectionIndex];
            const yOffset = -150;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
          break;
        }
        
        if (totalSelected > section.max) {
          const errorMsg = `لا يمكن اختيار أكثر من ${section.max} خيارات من قسم "${section.title}"`;
          setError(errorMsg);
          hasError = true;
          
          const sectionIndex = sections.findIndex(s => s.id === section.id);
          if (sectionIndex >= 0 && sectionRefs.current[sectionIndex]) {
            const element = sectionRefs.current[sectionIndex];
            const yOffset = -150;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
          break;
        }
      }
    }
    
    return !hasError;
  };

  const handleConfirm = () => {
    if (validateSelection()) {
      const selectedExtras = [];
      let deliveryDate = '';

      if (selectedOptions['deliveryDate']?.length > 0) {
        const optionName = selectedOptions['deliveryDate'][0];
        const dateKey = `deliveryDate-${optionName}`;
        deliveryDate = selectedDates[dateKey] || '';
      }

      sections.forEach(section => {
        if (selectedOptions[section.id]) {
          selectedOptions[section.id].forEach(optionName => {
            const option = section.options.find(o => o.name === optionName);
            if (option && option.price > 0) {
              const key = `${section.id}-${optionName}`;
              selectedExtras.push({
                name: option.name,
                price: option.price,
                quantity: optionQuantities[key] || 1
              });
            }
          });
        }
      });

      const newOrder = {
        id: Date.now(),
        title: product.title,
        image: product.image,
        basePrice: parseFloat(product.price),
        extras: selectedExtras,
        quantity,
        total: totalPrice,
        deliveryDate
      };

      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push(newOrder);
      localStorage.setItem('cart', JSON.stringify(cart));

      navigate('/cart');
    } else {
      if (errorTimeout.current) clearTimeout(errorTimeout.current);
      errorTimeout.current = setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  if (!product) return (
    <div className="loading-container">
        <Spinner />
    </div>
  );

  if (loadingSections) {
    return (
      <div className="loading-container">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="details-container">
      <div className="details-content">
        <div className="top-header">
          <div className="left-section">
            <img src={logo} alt="logo" className="logo-img" />
            <p className="lang-code">EN</p>
          </div>
          <div className="site-name">{product.title}</div>
          <button className="lang-switch" onClick={() => navigate(-1)}>
            <FaArrowRight className="back-icon" />
          </button>
        </div>

        <div className="prod-image">
          <img src={product.image} alt={product.title} />
        </div>
        
        <div className="productinfo">
          <p className="tit">{product.title}</p>
          <p className="desc">{product.description}</p>
          <div className="prices">
            <p className="priceName">السعر: </p>
            <p className="priceRealy">{formatPrice(product.price, currency)} {currency}</p>
          </div>
        </div>
        
        {sections.map((section, index) => (
          <Section
            key={section.id}
            section={section}
            index={index}
            sectionRefs={sectionRefs}
            selectedOptions={selectedOptions}
            optionQuantities={optionQuantities}
            handleOptionSelect={handleOptionSelect}
            handleOptionQuantityChange={handleOptionQuantityChange}
            handleDateChange={handleDateChange}
            selectedDates={selectedDates}
            productTitle={product?.title}
            currency={currency}
          />
        ))}
        
        <QuantityControl quantity={quantity} setQuantity={setQuantity} />
        
        {error && <ErrorMessage message={error} />}
        
        <ConfirmButton 
          totalPrice={totalPrice} 
          currency={currency} 
          handleConfirm={handleConfirm} 
        />
      </div>
    </div>
  );
}

export default Details;