// services/client.js
import axios from 'axios';
import { cookieStorage } from "@/services/storage/cookie";

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
    // Try to get token from Pinia store first (if available)
    let token = null;
    
    try {
      // Dynamically import store to avoid circular dependencies
      // This will be available after Pinia is initialized
      if (typeof window !== 'undefined' && window.__PINIA__) {
        const { useAuthStore } = require('@/stores/auth');
        const authStore = useAuthStore();
        token = authStore.token;
      }
    } catch (e) {
      // Fallback to cookies if store not available
      console.log('Store not available, falling back to cookies');
    }
    
    // Fallback to cookies if store didn't have token
    if (!token) {
      token = cookieStorage.get('auth_token');
    }
    
    console.log('📤 Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 50)}...` : 'none'
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header set');
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
  (response) => response.data,
  async (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.log('🔒 401 Unauthorized - Clearing auth');
      
      // Clear auth from store and cookies
      try {
        const { useAuthStore } = await import('@/stores/auth');
        const authStore = useAuthStore();
        authStore.clearAuth();
      } catch (e) {
        // Fallback to direct cookie removal
        cookieStorage.remove('auth_token');
        cookieStorage.remove('user_data');
      }
      
      // Redirect to login if not already there
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
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