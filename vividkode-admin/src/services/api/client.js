import axios from 'axios';
import { cookieStorage } from '../storage/cookie';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - Add token to header
apiClient.interceptors.request.use(
  (config) => {
    const token = cookieStorage.get('auth_token');
    
    console.log('📤 Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      tokenType: typeof token,
      tokenPreview: token ? `${token.substring(0, 50)}...` : 'none'
    });
    
    if (token) {
     
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header set');
    } else {
      // console.log('❌ No token found in cookies');
    }
  
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      console.log('📎 FormData detected, removed Content-Type header');
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses
apiClient.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', {
      url: response.config.url,
      status: response.status,
      success: response.data?.success
    });
    return response.data;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.log('🔒 401 Unauthorized - Clearing auth data');
      cookieStorage.remove('auth_token');
      cookieStorage.remove('user_data');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        console.log('Redirecting to login...');
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

export default apiClient;