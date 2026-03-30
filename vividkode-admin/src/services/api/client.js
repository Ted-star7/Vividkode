import axios from 'axios';
import { cookieStorage } from '../storage/cookie';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Send credentials (cookies) with every request
  withCredentials: true,
});

// Request interceptor - Add token to header
apiClient.interceptors.request.use(
  (config) => {
    // FIX: Read the token directly as a string, since it was saved as a string
    const token = cookieStorage.get('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle responses
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      cookieStorage.remove('auth_token');
      cookieStorage.remove('user_data');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Error Handling
    const formattedError = {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
      original: error
    };
    
    return Promise.reject(formattedError);
  }
);

export default apiClient;