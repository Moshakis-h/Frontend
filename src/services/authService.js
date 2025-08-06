// services/authService.js

export const verifyToken = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { isAuthenticated: false };
    }
    
    const response = await fetch('/api/auth/verify', {
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