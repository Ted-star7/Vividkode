import apiClient from '../client'
import { cookieStorage } from '../../storage/cookie'
import { API_ENDPOINTS } from '../endpoints'

export const authApi = {

  /**
   * Login user
   */
  async login(credentials) {
    try {
      // 1. Assign the result directly to apiResponse
      const apiResponse = await apiClient.post(
        API_ENDPOINTS.AUTH.LOGIN_V2,
        credentials
      )

      // 2. Now apiResponse is defined and we can check it
      if (apiResponse.success) {
        const payload = apiResponse.data

        // Save token
        cookieStorage.set('auth_token', payload.token)

        // Save user information
        cookieStorage.set('user_data', {
          id: payload.id,
          role: payload.role,
          name: payload.name,
          email: credentials.email
        })

        return {
          success: true,
          data: payload,
          message: apiResponse.message
        }
      }

      return {
        success: false,
        message: apiResponse.message || 'Login failed'
      }

    } catch (error) {
      console.error('Login error:', error)

      return {
        success: false,
        // Updated this to match how your client.js formats errors
        message: error.message || 'Login failed'
      }
    }
  },

  /**
   * Logout user
   */
  async logout() {

    cookieStorage.remove('auth_token')
    cookieStorage.remove('user_data')

    return true

  },

  /**
   * Get current logged in user
   */
  getCurrentUser() {

    const token = cookieStorage.get('auth_token')
    const user = cookieStorage.get('user_data')

    if (!token || !user) {
      return null
    }

    return {
      ...user,
      token
    }

  },

  /**
   * Check if authenticated
   */
  isAuthenticated() {

    const token = cookieStorage.get('auth_token')

    return !!token

  },

  /**
   * Get user role
   */
  getUserRole() {

    const user = cookieStorage.get('user_data')

    return user?.role || null

  },

  /**
   * Get user ID
   */
  getUserId() {

    const user = cookieStorage.get('user_data')

    return user?.id || null

  },

  /**
   * Forgot password
   */
  async forgotPassword(email) {

    try {

      const response = await apiClient.post(
        API_ENDPOINTS.FORGOT_PASSWORD,
        { email }
      )

      return response.data

    } catch (error) {

      console.error('Forgot password error:', error)

      throw error

    }

  },

  /**
   * Reset password
   */
  async resetPassword(data) {

    try {

      const response = await apiClient.post(
        API_ENDPOINTS.RESET_PASSWORD,
        data
      )

      return response.data

    } catch (error) {

      console.error('Reset password error:', error)

      throw error

    }

  },

  /**
   * Resend OTP
   */
  async resendOtp(email) {

    try {

      const response = await apiClient.post(
        API_ENDPOINTS.RESEND_OTP,
        { email }
      )

      return response.data

    } catch (error) {

      console.error('Resend OTP error:', error)

      throw error

    }

  }

}