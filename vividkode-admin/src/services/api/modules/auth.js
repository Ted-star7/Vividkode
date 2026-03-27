import apiClient from '../client';
import { cookieStorage } from '../../storage/cookie';
import { API_ENDPOINTS } from '../endpoints';

export const authApi = {
  /**
   * Login user with email and password
   */
  async login(credentials) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN_V2, credentials);
      
      if (response.success && response.data) {
        cookieStorage.set('auth_token', {
          token: response.data.token,
          id: response.data.id,
          role: response.data.role,
          name: response.data.name
        });
        
        cookieStorage.set('user_data', {
          id: response.data.id,
          role: response.data.role,
          email: credentials.email,
          name: response.data.name
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
    cookieStorage.remove('auth_token');
    cookieStorage.remove('user_data');
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
  },

  /**
   * Forgot password - Request OTP/reset link
   * @param {Object} data - { email }
   */
  async forgotPassword(email) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  /**
   * Reset password - Set new password using OTP
   * @param {Object} data - { email, otp, newPassword }
   */
  async resetPassword(data) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.RESET_PASSWORD, data);
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  /**
   * Resend OTP for password reset
   * @param {Object} data - { email }
   */
  async resendOtp(email) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.RESEND_OTP, { email });
      return response;
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw error;
    }
  }
};