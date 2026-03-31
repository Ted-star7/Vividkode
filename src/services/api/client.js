// services/client.js
import axios from 'axios';
import { localStorageService } from "@/services/storage/local";

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
    const token = localStorageService.get('auth_token');
    
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
      const url = String(error.config?.url || '');
      const isAuthSessionEndpoint =
        url.includes('/auth/me') ||
        url.includes('/auth/refresh') ||
        url.includes('/auth/session');

      // Only wipe auth for endpoints that *prove* the session is invalid.
      // A 401 from a business endpoint could be permissions/misconfig and should not log users out.
      if (isAuthSessionEndpoint) {
        console.log('🔒 401 on auth session endpoint - clearing auth');

        try {
          const { useAuthStore } = await import('@/stores/auth');
          const authStore = useAuthStore();
          authStore.clearAuth();
        } catch {
          localStorageService.remove('auth_token');
          localStorageService.remove('user_data');
        }

        // Soft-navigate to login (avoid full reload so Network/Console stay visible)
        try {
          const { default: router } = await import('@/router');
          if (router?.currentRoute?.value?.name !== 'login') {
            router.push({ name: 'login' }).catch(() => {});
          }
        } catch {
          // ignore
        }
      } else {
        console.warn('⚠️ 401 from non-auth endpoint; not logging out automatically:', url);
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