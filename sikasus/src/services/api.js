import axios from 'axios';
import config from '../config/config';

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    
    // Handle 401 (unauthorized) - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('isLoggedIn');
      window.location.reload();
    }
    
    throw error;
  }
);

export const authService = {
  async login(username, password) {
    try {
      const response = await api.post('/api/auth/login', { username, password });
      const { token, user } = response.data;
      
      // Store token and user info
      localStorage.setItem('authToken', token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    return localStorage.getItem('authToken') && localStorage.getItem('isLoggedIn') === 'true';
  }
};

export const employeeService = {
  async getAll() {
    try {
      const response = await api.get('/api/employees');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      throw new Error('Failed to fetch employees: ' + error.message);
    }
  },
  
  // Add more API methods as needed
};

export default api;
