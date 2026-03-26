import apiClient from '../client';
import { cookieStorage } from '../../storage/cookie';

export const authApi = {
  /**
   * Login user with email and password
   * @param {Object} credentials - { email, password }
   * @returns {Promise} - Login response
   */
  async login(credentials) {
    try {
      const response = await apiClient.post('/api/open/auth/login/v1', credentials);
      
      
      if (response.success && response.data) {
        // Store token in cookie
        cookieStorage.set('auth_token', {
          token: response.data.token,
          id: response.data.id,
          role: response.data.role
        });
        
        // Store user data separately if needed
        cookieStorage.set('user_data', {
          id: response.data.id,
          role: response.data.role,
          email: credentials.email
        });
        
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      }
      
      return response;
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  /**
   * Logout user
   */
  async logout() {
      {
      // Clear all auth cookies
      cookieStorage.remove('auth_token');
      cookieStorage.remove('user_data');
    }
  },
  
  /**
   * Get current user from stored cookie
   */
  getCurrentUser() {
    const tokenData = cookieStorage.get('auth_token');
    const userData = cookieStorage.get('user_data');
    
    if (tokenData && userData) {
      return {
        id: tokenData.id || userData.id,
        role: tokenData.role || userData.role,
        email: userData.email,
        token: tokenData.token
      };
    }
    return null;
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const tokenData = cookieStorage.get('auth_token');
    return !!(tokenData && tokenData.token);
  },
  
  /**
   * Get user role
   */
  getUserRole() {
    const tokenData = cookieStorage.get('auth_token');
    return tokenData?.role || null;
  },
  
  /**
   * Get user ID
   */
  getUserId() {
    const tokenData = cookieStorage.get('auth_token');
    return tokenData?.id || null;
  }
};