import React, { useEffect, useState } from 'react';
import '../Style/Admin.css';
import axios from 'axios';

function Admin() {
  const [products, setProducts] = useState([]);
  const [currency, setCurrency] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [users, setUsers] = useState([]);
  const [tempPrices, setTempPrices] = useState({});
  const [additionPrices, setAdditionPrices] = useState([]);
  const [editingSections, setEditingSections] = useState({});
  const [adminForm, setAdminForm] = useState({
    currentPassword: '',
    newEmail: '',
    newPassword: '',
    confirmPassword: ''
  });

  // تهيئة axios مع رأس التوكن
  const axiosWithToken = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  });

  // الدالة لتحميل المنتجات
  const loadProducts = async () => {
    try {
      const res = await axiosWithToken.get('/api/admin/products');
      if (res.status !== 200) throw new Error('فشل تحميل المنتجات');
      setProducts(res.data);
      
      const initialTempPrices = {};
      res.data.forEach(product => {
        initialTempPrices[product._id] = product.price;
      });
      setTempPrices(initialTempPrices);
    } catch (error) {
      showAlert(error.message, 'error');
    }
  };

  // الدالة لتحميل الإعدادات
  const loadSettings = async () => {
    try {
      const res = await axiosWithToken.get('/api/admin/settings');
      if (res.status !== 200) throw new Error('فشل تحميل الإعدادات');
      const data = res.data;
      if (data) {
        setCurrency(data.currency);
        setCountry(data.country);
      }
    } catch (error) {
      showAlert(error.message, 'error');
    }
  };

  // الدالة لتحميل المستخدمين
  const loadUsers = async () => {
    try {
      const res = await axiosWithToken.get('/api/admin/users');
      if (res.status !== 200) throw new Error('فشل تحميل المستخدمين');
      setUsers(res.data);
    } catch (error) {
      showAlert('فشل في تحميل المستخدمين', 'error');
    }
  };

  // جلب أسعار الإضافات
  const loadAdditionPrices = async () => {
    try {
      const res = await axiosWithToken.get('/api/admin/addition-prices');
      setAdditionPrices(res.data);
      
      const initialEditing = {};
      res.data.forEach(section => {
        initialEditing[section.sectionId] = [...section.items];
      });
      setEditingSections(initialEditing);
    } catch (error) {
      showAlert('فشل تحميل أسعار الإضافات', 'error');
    }
  };

  // الدالة لتحديث توجيه المستخدم
  const updateUserRedirect = async (userId, redirectPage) => {
    try {
      const res = await axiosWithToken.put(
        `/api/admin/user/${userId}/redirect`,
        { redirectPage }
      );
      
      if (res.status !== 200) throw new Error('فشل في تحديث المستخدم');
      
      showAlert(res.data.message, 'success');
      loadUsers();
    } catch (error) {
      showAlert(error.message, 'error');
    }
  };

  // الدالة لتغيير السعر المؤقت
  const handleTempPriceChange = (id, value) => {
    setTempPrices(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // الدالة لتحديث السعر
  const handleUpdatePrice = async (id) => {
    const newPrice = tempPrices[id];
    if (!newPrice) {
      showAlert('السعر غير صالح', 'error');
      return;
    }
    
    try {
      const res = await axiosWithToken.put(
        `/api/admin/product/${id}`,
        { price: newPrice }
      );
      
      if (res.status !== 200) {
        throw new Error(res.data.message || 'فشل تحديث السعر');
      }
      
      showAlert('تم تحديث السعر بنجاح', 'success');
      loadProducts();
    } catch (error) {
      showAlert(error.message, 'error');
    }
  };

  // الدالة لإضافة منتج جديد
  const addProduct = async (e) => {
    e.preventDefault();
    const form = e.target;

    const product = {
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      image: form.image.value.trim(),
      price: form.price.value.trim(),
      category: form.category.value.trim()
    };

    try {
      const res = await axiosWithToken.post(
        '/api/admin/product',
        product
      );

      if (res.status !== 201) {
        throw new Error(res.data.message || 'فشل إضافة المنتج');
      }

      form.reset();
      showAlert('تمت إضافة المنتج بنجاح', 'success');
      loadProducts();
    } catch (error) {
      showAlert(error.message, 'error');
    }
  };

  // الدالة لتحديث الإعدادات
  const updateSettings = async () => {
    try {
      const res = await axiosWithToken.post(
        '/api/admin/settings',
        { currency }
      );
      
      if (res.status !== 200) {
        throw new Error(res.data.message || 'فشل تحديث الإعدادات');
      }
      
      showAlert('تم تحديث الإعدادات بنجاح', 'success');
      loadSettings();
    } catch (error) {
      showAlert(error.message, 'error');
    }
  };

  // تحديث السعر المحلي للإضافات
  const handleAdditionPriceChange = (sectionId, index, value) => {
    setEditingSections(prev => ({
      ...prev,
      [sectionId]: prev[sectionId].map((item, i) => 
        i === index ? { ...item, price: Number(value) } : item
      )
    }));
  };

  // حفظ أسعار الإضافات
  const saveAdditionPrices = async () => {
    try {
      const updates = Object.entries(editingSections).map(([sectionId, items]) => ({
        sectionId,
        items
      }));

      await axiosWithToken.put(
        '/api/admin/addition-prices',
        updates
      );
      
      showAlert('تم تحديث أسعار الإضافات بنجاح', 'success');
      loadAdditionPrices();
    } catch (error) {
      showAlert('فشل في تحديث أسعار الإضافات', 'error');
    }
  };

  // الدالة لعرض التنبيهات
  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  // تحديث بيانات الحقول في قسم المسؤول
  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    
    if (adminForm.newPassword && adminForm.newPassword !== adminForm.confirmPassword) {
      showAlert('كلمة المرور الجديدة وتأكيدها غير متطابقين', 'error');
      return;
    }

    try {
      const res = await axiosWithToken.put(
        '/api/admin/update-admin',
        {
          currentPassword: adminForm.currentPassword,
          newEmail: adminForm.newEmail || undefined,
          newPassword: adminForm.newPassword || undefined
        }
      );

      setAdminForm({
        currentPassword: '',
        newEmail: '',
        newPassword: '',
        confirmPassword: ''
      });

      showAlert('تم تحديث بيانات المسؤول بنجاح', 'success');

      if (res.data.updatedFields.passwordUpdated) {
        setTimeout(() => {
          showAlert('تم تغيير كلمة المرور، سيتم تسجيل خروجك خلال 5 ثوانٍ', 'info');
          setTimeout(() => {
            window.location.href = '/login';
          }, 5000);
        }, 2000);
      }
    } catch (error) {
      const errorMsg = 'تم تحديث البيانات ';
      showAlert(errorMsg, 'success');
    }
  };

  useEffect(() => {
    // التحقق من صلاحية الوصول
    const checkAccess = async () => {
      try {
        const res = await axiosWithToken.get('/api/protected/admin');
        if (res.status !== 200) {
          showAlert('لا تملك صلاحية الوصول', 'error');
          setTimeout(() => window.location.href = './', 2000);
        } else {
          setLoading(false);
        }
      } catch (error) {
        showAlert('خطأ في التحقق من الصلاحيات', 'error');
      }
    };

    checkAccess();
    loadProducts();
    loadSettings();
    loadUsers();
    loadAdditionPrices();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="admin-loading-spinner"></div>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>لوحة تحكم الأدمن</h1>
      </div>

      {alert.show && (
        <div className={`admin-alert ${alert.type === 'success' ? '' : 'admin-alert-error'}`}>
          {alert.message}
        </div>
      )}

      <div className="admin-section">
        <h2>تغيير بيانات المسؤول</h2>
        
        <form onSubmit={handleAdminUpdate} className="admin-form-grid">
          <div className="admin-form-group">
            <label htmlFor="currentPassword" className="admin-label">
              كلمة المرور الحالية *
            </label>
            <input
              type="password"
              className="admin-input"
              placeholder="كلمة المرور الحالية"
              name="currentPassword"
              value={adminForm.currentPassword}
              onChange={handleAdminChange}
              required
            />
          </div>
          
          <div className="admin-form-group">
            <label htmlFor="newEmail" className="admin-label">
              البريد الإلكتروني الجديد
            </label>
            <input
              type="email"
              className="admin-input"
              placeholder="البريد الإلكتروني الجديد"
              name="newEmail"
              value={adminForm.newEmail}
              onChange={handleAdminChange}
            />
          </div>
          
          <div className="admin-form-group">
            <label htmlFor="newPassword" className="admin-label">
              كلمة المرور الجديدة
            </label>
            <input
              type="password"
              className="admin-input"
              placeholder="كلمة المرور الجديدة"
              name="newPassword"
              value={adminForm.newPassword}
              onChange={handleAdminChange}
            />
            <div className="admin-password-hint">
              (اتركه فارغًا إذا كنت لا تريد تغيير كلمة المرور)
            </div>
          </div>
          
          <div className="admin-form-group">
            <label htmlFor="confirmPassword" className="admin-label">
              تأكيد كلمة المرور الجديدة
            </label>
            <input
              type="password"
              className="admin-input"
              placeholder="تأكيد كلمة المرور الجديدة"
              name="confirmPassword"
              value={adminForm.confirmPassword}
              onChange={handleAdminChange}
            />
          </div>

          <div className="admin-form-group admin-form-button">
            <button type="submit" className="admin-button">تحديث بيانات المسؤول</button>
          </div>
        </form>
      </div>

      <div className="admin-section">
        <h2>إعدادات العملة</h2>
        <div className="admin-settings-container">
          <select
            className="admin-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="د.ك">دينار كويتي</option>
            <option value="د.ا">درهم إماراتي</option>
            <option value="ر.ق">ريال قطري</option>
            <option value="ر.س">ريال سعودي</option>
          </select>
          <button className="admin-button" onClick={updateSettings}>
            تحديث الإعدادات
          </button>
        </div>
        <div className="admin-country-display">
          <p>البلد: {country}</p>
        </div>
      </div>

      <div className="admin-section">
        <h2>إدارة توجيه المستخدمين</h2>
        <div className="admin-users-table">
          <table>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>البريد</th>
                <th>الهاتف</th>
                <th>البلد</th>
                <th>التوجيه الحالي</th>
                <th>التحكم</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.country}</td>
                  <td>{user.redirectPage === 'success' ? 'Success' : 'Wrong'}</td>
                  <td>
                    <button
                      className={`admin-action-button ${user.redirectPage === 'success' ? 'active' : ''}`}
                      onClick={() => updateUserRedirect(user._id, 'success')}
                    >
                      Success
                    </button>
                    <button
                      className={`admin-action-button ${user.redirectPage === 'wrong' ? 'active' : ''}`}
                      onClick={() => updateUserRedirect(user._id, 'wrong')}
                    >
                      Wrong
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-section">
        <h2>إضافة منتج جديد</h2>
        <form id="addProductForm" onSubmit={addProduct} className="admin-form-grid">
          <div className="admin-form-group">
            <label htmlFor="title" className="admin-label">عنوان المنتج</label>
            <input
              type="text"
              className="admin-input"
              placeholder="العنوان"
              name="title"
              required
            />
          </div>
          
          <div className="admin-form-group">
            <label htmlFor="description" className="admin-label">وصف المنتج</label>
            <input
              type="text"
              className="admin-input"
              placeholder="الوصف"
              name="description"
              required
            />
          </div>
          
          <div className="admin-form-group">
            <label htmlFor="image" className="admin-label">رابط الصورة</label>
            <input
              type="text"
              className="admin-input"
              placeholder="رابط الصورة"
              name="image"
              required
            />
          </div>
          
          <div className="admin-form-group">
            <label htmlFor="price" className="admin-label">السعر</label>
            <input
              type="text"
              className="admin-input"
              placeholder="السعر"
              name="price"
              required
            />
          </div>
          
          <div className="admin-form-group">
            <label htmlFor="category" className="admin-label">التصنيف</label>
            <select name="category" className="admin-select" required>
              <option value="">اختر التصنيف</option>
              <option value="عروض المناسبات">عروض المناسبات</option>
              <option value="بوفيهات الريوق">بوفيهات الريوق</option>
              <option value="خدمات إضافية">خدمات إضافية</option>
            </select>
          </div>

          <div className="admin-form-group admin-form-button">
            <button type="submit" className="admin-button">إضافة منتج</button>
          </div>
        </form>
      </div>

      <div className="admin-section">
        <h2>كل المنتجات ({products.length})</h2>
        <div className="admin-product-list">
          {products.map((p) => (
            <div className="admin-product-card" key={p._id}>
              <img src={p.image} className="admin-product-image" alt={p.title} />
              <div className="admin-product-content">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="admin-price-update-container">
                  <div className="admin-price-input">
                    <label>السعر:</label>
                    <input
                      type="text"
                      value={tempPrices[p._id] || p.price}
                      onChange={(e) => handleTempPriceChange(p._id, e.target.value)}
                    />
                  </div>
                  <button
                    className="admin-update-button"
                    onClick={() => handleUpdatePrice(p._id)}
                  >
                    تحديث السعر
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-section">
        <h2>إدارة أسعار الإضافات</h2>
        
        {additionPrices.map(section => (
          <div key={section._id} className="addition-price-section">
            <h3>{section.sectionName}</h3>
            
            <div className="addition-price-grid">
              {editingSections[section.sectionId]?.map((item, index) => (
                <div key={index} className="addition-price-item">
                  <div className="addition-price-name">{item.name}</div>
                  <input
                    type="number"
                    className="admin-input"
                    value={item.price}
                    onChange={(e) => handleAdditionPriceChange(section.sectionId, index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <button className="admin-button" onClick={saveAdditionPrices}>
          حفظ جميع التغييرات
        </button>
      </div>
    </div>
  );
}

export default Admin;