import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import galleryData from '../utils/galleryData';
import '../Style/GalleryHome.css';

function GalleryHome() {
  const location = useLocation();
  const scrollToHeater = location.state?.scrollToHeater;

  useEffect(() => {
    if (scrollToHeater) {
      const element = document.getElementById(scrollToHeater);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // إضافة تمييز للسخان
        element.classList.add('highlighted');
        setTimeout(() => {
          element.classList.remove('highlighted');
        }, 2000);
      }
    }
  }, [scrollToHeater]);

  return (
    <div className="gallery-home">
      <div className="gallery-header">
        <h1>معرض أشكال السخانات</h1>
        <p>اختر سخاناً لرؤية صورته بالتفصيل</p>
      </div>
      
      <div className="heaters-grid">
        {Object.entries(galleryData).map(([heaterName, imageName]) => (
          <Link 
            to={`/gallery/${heaterName}`} 
            key={heaterName}
            className="heater-card"
            id={heaterName}
          >
            <div className="heater-image-container">
              <img 
                src={`/Pofih/${imageName}`} 
                alt={heaterName} 
              />
            </div>
            <div className="heater-name">{heaterName}</div>
          </Link>
        ))}
      </div>
      
      <div className="gallery-footer">
        <p>جميع الحقوق محفوظة © 2023</p>
      </div>
    </div>
  );
}

export default GalleryHome;