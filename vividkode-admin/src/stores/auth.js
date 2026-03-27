import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, cookieStorage } from '@/services'

export const useAuthStore = defineStore('auth', () => {
  // State
  const tokenData = ref(null)
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const initialized = ref(false)

  // Getters
  const token = computed(() => tokenData.value?.token || null)
  const isAuthenticated = computed(() => {
    const hasToken = !!token.value
    const hasUser = !!user.value
    console.log('isAuthenticated check:', { hasToken, hasUser, token: token.value })
    return hasToken && hasUser
  })
  
  const userName = computed(() => {
    if (!user.value) return 'Admin'
    if (user.value.name) return user.value.name
    if (user.value.email) {
      const emailName = user.value.email.split('@')[0]
      return emailName.charAt(0).toUpperCase() + emailName.slice(1).toLowerCase()
    }
    return 'Admin'
  })

  function init() {
    if (initialized.value) return
    
    // console.log('Initializing auth store...')
    
    const storedToken = cookieStorage.get('auth_token')
    const storedUser = cookieStorage.get('user_data')
    
    // Validate token (check if it's expired or valid)
    if (storedToken && storedUser) {
    // Validate token expiration
      const isValid = validateToken(storedToken.token)
      
      if (isValid) {
        tokenData.value = storedToken
        user.value = storedUser
        console.log('Auth initialized with valid token')
      } else {
        console.log('Token expired or invalid, clearing auth')
        clearAuth()
      }
    } else {
      console.log('No stored auth data found')
    }
    
    initialized.value = true
  }
  
  function validateToken(token) {
    if (!token) return false
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const exp = payload.exp
      
      if (exp) {
        // Check if token is expired
        const isExpired = Date.now() >= exp * 1000
        if (isExpired) {
          console.log('Token expired')
          return false
        }
      }
      
      return true
    } catch (error) {
      // If not JWT or can't decode, assume valid
      // console.log('Token validation skipped (not JWT)')
      return true
    }
  }
  
  // Clear all auth data
  function clearAuth() {
    tokenData.value = null
    user.value = null
    cookieStorage.remove('auth_token')
    cookieStorage.remove('user_data')
    console.log('Auth data cleared')
  }

  async function login(credentials) {
    loading.value = true
    error.value = null
    
    try {
      const response = await authApi.login(credentials)
      
      if (response.success) {
        // Update state from cookies
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

  function logout() {
    authApi.logout()
    clearAuth()
  }

  // Initialize on store creation
  init()

  return {
    // State
    tokenData,
    user,
    loading,
    error,
    initialized,
    
    // Getters
    token,
    isAuthenticated,
    userName,
    
    // Actions
    login,
    logout,
    init,
    clearAuth
  }
})