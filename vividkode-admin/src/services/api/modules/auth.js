// services/api/modules/auth.js
import apiClient from '../../client'; 
import { API_ENDPOINTS } from '../../endpoints'; 

export const authApi = {

  /**
   * Login user
   */
  async login(credentials) {
    try {
      const apiResponse = await apiClient.post(
        API_ENDPOINTS.AUTH.LOGIN_V2,
        credentials
      );

      if (apiResponse.success) {
        const payload = apiResponse.data;
        
        // Return the data - let the store handle storage
        return {
          success: true,
          data: {
            token: payload.token,
            user: {
              id: payload.id,
              role: payload.role,
              name: payload.name,
              email: credentials.email
            }
          },
          message: apiResponse.message
        };
      }

      return {
        success: false,
        message: apiResponse.message || 'Login failed'
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      // Optional: Call logout endpoint if your API has one
      // await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },

  /**
   * Get current logged in user
   */
  async getCurrentUser() {
    try {
      // You might need to add ME endpoint to API_ENDPOINTS
      const response = await apiClient.get('/api/auth/me');
      if (response.success) {
        return {
          success: true,
          data: response.data
        };
      }
      return {
        success: false,
        message: response.message || 'Failed to get user'
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        message: error.message || 'Failed to get user'
      };
    }
  },

  /**
   * Forgot password
   */
  async forgotPassword(email) {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        { email }
      );
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  /**
   * Reset password
   */
  async resetPassword(data) {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        data
      );
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  /**
   * Resend OTP
   */
  async resendOtp(email) {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.RESEND_OTP,
        { email }
      );
      return response;
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw error;
    }
  },

  /**
   * Change password (authenticated)
   */
  async changePassword(data) {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        data
      );
      return response;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  /**
   * Verify OTP
   */
  async verifyOtp(data) {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.VERIFY_OTP,
        data
      );
      return response;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  },

  /**
   * Refresh token
   */
  async refreshToken() {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.REFRESH_TOKEN
      );
      return response;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }
};