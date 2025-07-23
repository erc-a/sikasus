import axios from 'axios';
import config from '../config/config';

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    throw error;
  }
);

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
