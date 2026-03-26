import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, cookieStorage } from '@/services'

export const useAuthStore = defineStore('auth', () => {
  // State - Initialize from cookies
  const tokenData = ref(cookieStorage.get('auth_token') || null)
  const user = ref(cookieStorage.get('user_data') || null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const token = computed(() => tokenData.value?.token || null)
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isSuperAdmin = computed(() => user.value?.role === 'super_admin')
  const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.role === 'super_admin')
  const userRole = computed(() => user.value?.role || null)
  const userId = computed(() => tokenData.value?.id || user.value?.id || null)
  const userEmail = computed(() => user.value?.email || null)

  /**
   * Login with email and password
   * @param {Object} credentials - { email, password }
   * @returns {Promise} - Login result
   */
  async function login(credentials) {
    loading.value = true
    error.value = null
    
    try {
  
      const response = await authApi.login(credentials)
      
      if (response.success) {
        // Token and user data are already stored in cookies by authApi.login()
        // Just update our reactive state
        tokenData.value = cookieStorage.get('auth_token')
        user.value = cookieStorage.get('user_data')
        
        return {
          success: true,
          data: response.data,
          message: response.message
        }
      } else {
        error.value = response.message || 'Login failed'
        return {
          success: false,
          error: error.value
        }
      }
      
    } catch (err) {
      error.value = err.message || 'An error occurred during login'
      return {
        success: false,
        error: error.value
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Logout user
   */
  function logout() {
    authApi.logout() // This clears cookies
    tokenData.value = null
    user.value = null
    error.value = null
  }

  /**
   * Check and refresh token if needed (optional)
   */
  async function checkAndRefreshToken() {
    if (!isAuthenticated.value) return false
    
    // Optional: Check if token is expired and refresh
    // You can decode JWT to check expiration
    try {
      // Example: Check if token is about to expire
      // const tokenExpiry = decodeToken(token.value).exp
      // if (tokenExpiry < Date.now() / 1000 + 300) { // Expires in < 5 min
      //   await authApi.refreshToken()
      //   tokenData.value = cookieStorage.get('auth_token')
      // }
      return true
    } catch (err) {
      console.error('Token refresh failed:', err)
      logout()
      return false
    }
  }

  /**
   * Get current user data from store
   */
  function getCurrentUser() {
    return user.value
  }

  /**
   * Update user data (if your API supports it)
   */
  async function updateUser(data) {
    // Implement if you have an update profile endpoint
    // const updatedUser = await authApi.updateProfile(data)
    // user.value = updatedUser
    // cookieStorage.set('user_data', updatedUser)
  }

  return {
    // State
    tokenData,
    user,
    loading,
    error,
    
    // Getters (computed)
    token,
    isAuthenticated,
    isSuperAdmin,
    isAdmin,
    userRole,
    userId,
    userEmail,
    
    // Actions
    login,
    logout,
    checkAndRefreshToken,
    getCurrentUser,
    updateUser
  }
})