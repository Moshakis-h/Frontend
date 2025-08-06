import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password
    });
    
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logoutUser = async () => {
  try {
    await axios.post(`${API_BASE_URL}/api/auth/logout`);
    removeAuthToken();
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

export const verifyToken = async () => {
  const token = getAuthToken();
  
  if (!token) return { isAuthenticated: false };
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  } catch (error) {
    return { isAuthenticated: false };
  }
};

axios.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});