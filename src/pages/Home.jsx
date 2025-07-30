import { useEffect, useState, useRef, useMemo } from 'react';
import '../Style/Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [products, setProducts] = useState([]);
  const [currency, setCurrency] = useState('د.ك');
  const [categories, setCategories] = useState([]);
  const sectionRefs = useRef({});
  const navigate = useNavigate();
  
  // جلب البيانات من السيرفر
  useEffect(() => {
  const fetchData = async () => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

      const settingsRes = await fetch(`${API_BASE_URL}/api/public/settings`);
      const settingsData = await settingsRes.json();
      if (settingsData.currency) {
        setCurrency(settingsData.currency);
      }

      const productsRes = await fetch(`${API_BASE_URL}/api/products`);
      const productsData = await productsRes.json();
      setProducts(productsData);

      const uniqueCategories = [...new Set(productsData.map((p) => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('فشل جلب البيانات:', error);
    }
  };

  fetchData();
}, []);

  // تحديد ترتيب التصنيفات المطلوب
  const orderedCategories = useMemo(() => {
    const priorityOrder = [
      "عروض المناسبات",
      "بوفيهات الريوق",
      "خدمات إضافية"
    ];
    
    // إعادة ترتيب التصنيفات حسب الأولوية المحددة
    return [...categories].sort((a, b) => {
      const aIndex = priorityOrder.indexOf(a);
      const bIndex = priorityOrder.indexOf(b);
      
      // إذا كان كلا التصنيفين في قائمة الأولوية
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      // إذا كان التصنيف أ فقط في قائمة الأولوية
      if (aIndex !== -1) return -1;
      
      // إذا كان التصنيف ب فقط في قائمة الأولوية
      if (bIndex !== -1) return 1;
      
      // إذا لم يكن أي منهما في قائمة الأولوية، احتفظ بالترتيب الأصلي
      return categories.indexOf(a) - categories.indexOf(b);
    });
  }, [categories]);

  // التنقل إلى القسم عند الضغط على زر التصنيف
  const scrollToCategory = (category) => {
    const section = sectionRefs.current[category];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // تتبع التمرير لتحديد الزر النشط
  useEffect(() => {
    const onScroll = () => {
      const fromTop = window.scrollY + 100;
      orderedCategories.forEach((cat) => {
        const section = sectionRefs.current[cat];
        const btn = document.querySelector(`button[data-category="${cat}"]`);
        if (section?.offsetTop <= fromTop && section?.offsetTop + section.offsetHeight > fromTop) {
          document.querySelectorAll('.category-buttons button').forEach((b) => b.classList.remove('active'));
          if (btn) btn.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [orderedCategories]);

  return (
    <section className="products-section">
    <div className="logoHead">
      <img src="Pofih/banner_3202_1717508965.jpg.jpeg" />
    </div>    
    <div className="conn">
      <div className="category-buttons" id="category-buttons">
        {orderedCategories.map((cat, idx) => (
          <button
            key={cat}
            data-category={cat}
            className={idx === 0 ? 'active' : ''}
            onClick={() => scrollToCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="product-list" id="product-list">
        {orderedCategories.map((cat) => (
          <div
            className="product-category"
            id={`cat-${cat}`}
            key={cat}
            ref={(el) => (sectionRefs.current[cat] = el)}
          >
            <h3>{cat}</h3>
            {products
              .filter((product) => product.category === cat)
              .map((product) => (
                <div
                  className="product-item"
                  key={product._id}
                  onClick={() => {
                    localStorage.setItem('selectedProduct', JSON.stringify(product));
                    localStorage.setItem('currency', currency);
                    navigate('/details');
                  }}
                >
                  <img src={product.image} alt={product.title} />
                  <div className="product-info">
                    <p className="title">{product.title}</p>
                    <p className="description">{product.description}</p>
                    <div className="price-cart">
                      <div className="priceSet">
                        <p className="currency">{currency}</p>
                        <span className="price">{product.price}</span>
                      </div>
                      <button className="addto-cart">+ أضف إلسلة</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}

export default Home;