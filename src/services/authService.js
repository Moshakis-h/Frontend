// authService.js

// استبدل جميع التصديرات الافتراضية بتصديرات مسماة
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'معلومات التسجيل غير صحيحة');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'حدث خطأ أثناء تسجيل الدخول');
  }
};

export const logoutUser = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('تعذر تسجيل الخروج');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'حدث خطأ أثناء تسجيل الخروج');
  }
};

export const verifyToken = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { isAuthenticated: false };
    }
    
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    return { isAuthenticated: false };
  }
};