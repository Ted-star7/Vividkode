import axios from 'axios';
import { cookieStorage } from '../storage/cookie';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Important: Tell axios to send cookies with requests
  withCredentials: true,
});

// Request interceptor - Add token to header
apiClient.interceptors.request.use(
  (config) => {
    // Get token from cookie
    const tokenData = cookieStorage.get('auth_token');
    const token = tokenData?.token;
    
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
      // Clear auth data
      cookieStorage.remove('auth_token');
      cookieStorage.remove('user_data');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Format error for easier handling
    const formattedError = {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
      original: error
    };
    
    return Promise.reject(formattedError);
  }
);

// Make sure to export default
export default apiClient;