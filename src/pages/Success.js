// Success.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

const Success = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);

  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #fdf6e3 0%, #f8e8d5 100%)',
      padding: '20px',
      paddingBottom: '60px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#333',
      textAlign: 'center',
    },
    card: {
      width: '100%',
      maxWidth: '500px',
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(166, 119, 105, 0.2)',
      overflow: 'hidden',
      animation: 'fadeIn 0.8s ease-out',
      position: 'relative',
    },
    header: {
      height: '150px',
      backgroundColor: '#A67769',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    headerCircle: {
      position: 'absolute',
      width: '250px',
      height: '250px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    checkmarkContainer: {
      position: 'relative',
      width: '140px',
      height: '140px',
      margin: '-70px auto 20px',
    },
    checkmarkCircle: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      backgroundColor: '#A67769',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 5px 15px rgba(166, 119, 105, 0.3)',
      border: '8px solid #f8e8d5',
    },
    checkmarkSvg: {
      width: '70px',
      height: '70px',
      stroke: 'white',
      strokeWidth: '6',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeDasharray: '100',
      strokeDashoffset: '100',
      animation: 'drawCheck 0.8s ease forwards 0.5s',
    },
    content: {
      padding: '30px',
      textAlign: 'center',
    },
    title: {
      fontSize: '32px',
      marginBottom: '15px',
      color: '#A67769',
      fontWeight: '700',
      letterSpacing: '0.5px',
    },
    message: {
      fontSize: '18px',
      lineHeight: '1.6',
      marginBottom: '20px',
      color: '#555',
      maxWidth: '400px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    highlight: {
      color: '#A67769',
      fontWeight: '600',
    },
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '30px',
    },
    button: {
      padding: '16px 40px',
      borderRadius: '50px',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#A67769',
      color: 'white',
      boxShadow: '0 4px 15px rgba(166, 119, 105, 0.3)',
    },
    footer: {
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f9f9f9',
      color: '#888',
      fontSize: '14px',
      borderTop: '1px solid #eee',
      marginTop: '20px',
    },
    confetti: {
      position: 'absolute',
      width: '12px',
      height: '12px',
      backgroundColor: '#A67769',
      borderRadius: '50%',
      animation: 'fall 5s linear infinite',
    },
  };

  const handleClick = () => {
    navigate('/');
  };

  const confettiElements = Array.from({ length: 30 }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * -20 - 10}%`,
      animationDelay: `${Math.random() * 5}s`,
      backgroundColor: [
        '#A67769', 
        '#D4A096', 
        '#8D6B64', 
        '#E8C4B8', 
        '#C19A6B'
      ][Math.floor(Math.random() * 5)],
      width: `${Math.random() * 10 + 6}px`,
      height: `${Math.random() * 10 + 6}px`,
    };
    return <div key={i} style={{...styles.confetti, ...style}} />;
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {confettiElements}
        
        <div style={styles.header}>
          <div style={styles.headerCircle}></div>
        </div>
        
        <div style={styles.checkmarkContainer}>
          <div style={styles.checkmarkCircle}>
            <svg style={styles.checkmarkSvg} viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        
        <div style={styles.content}>
          <h1 style={styles.title}>تمت عملية الدفع بنجاح!</h1>
          <p style={styles.message}>
            تم استلام <span style={styles.highlight}>الطلب</span> بنجاح. نشكرك على ثقتك بنا ونسعد بخدمتك في أي وقت.
            سنتواصل معك قريبًا لتأكيد تفاصيل التسليم.
          </p>
          
          <div style={styles.buttonsContainer}>
            <button style={styles.button} onClick={handleClick}>
              العودة للصفحة الرئيسية
            </button>
          </div>
        </div>
        
        <div style={styles.footer}>
          <div>شكرًا لاختيارك متجرنا. للاستفسارات: info@store.com | 0123456789</div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
        
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        
        @media (max-width: 500px) {
          .success-card {
            border-radius: 15px;
          }
          
          h1 {
            font-size: 24px;
          }
          
          p {
            font-size: 16px;
          }
          
          .card-content {
            padding: 20px;
          }
          
          .checkmark-container {
            width: 120px;
            height: 120px;
            margin: -60px auto 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default Success;