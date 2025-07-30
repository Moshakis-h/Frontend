import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import galleryData from '../utils/galleryData';
import '../Style/HeaterDetail.css';

function HeaterDetail() {
  const { heaterName } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // استرجاع الصورة بناءً على اسم السخان
    const heaterImage = galleryData[heaterName];
    
    // محاكاة تحميل الصورة
    setTimeout(() => {
      if (heaterImage) {
        setImage(heaterImage);
      } else {
        // إذا لم توجد صورة، ارجع إلى المعرض
        navigate('/gallery');
      }
      setLoading(false);
    }, 500);
  }, [heaterName, navigate]);

  const handleBack = () => {
    navigate('/gallery');
  };

  if (loading) {
    return (
      <div className="heater-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل الصورة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="heater-detail-container">
      <div className="heater-header">
        <button onClick={handleBack} className="back-button">
          <FaArrowLeft /> العودة للمعرض
        </button>
        <h1>{heaterName}</h1>
      </div>

      <div className="heater-image-container">
        <img 
          src={`/Pofih/${image}`} 
          alt={heaterName} 
          className="heater-image"
        />
      </div>
      
      <div className="heater-info">
        <p>هذه الصورة توضح شكل السخان الذي اخترته. يمكنك العودة لصفحة المعرض لاستعراض المزيد من السخانات.</p>
      </div>
    </div>
  );
}

export default HeaterDetail;