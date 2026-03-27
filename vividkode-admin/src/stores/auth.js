import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, cookieStorage } from '@/services'

export const useAuthStore = defineStore('auth', () => {
  // State
  const tokenData = ref(null)
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const token = computed(() => tokenData.value?.token || null)
  const isAuthenticated = computed(() => {
    const hasToken = !!token.value
    const hasUser = !!user.value
    return hasToken && hasUser
  })
  
  const userName = computed(() => {
    if (!user.value) return 'Admin'
    if (user.value.name) return user.value.name

    
    return 'Admin'
  })
  
  // Get user role
  const userRole = computed(() => user.value?.role || null)
  
  // Get user email
  const userEmail = computed(() => user.value?.email || null)

  // Initialize from cookies
  function init() {
    const storedToken = cookieStorage.get('auth_token')
    const storedUser = cookieStorage.get('user_data')
    
    if (storedToken && storedUser) {
      tokenData.value = storedToken
      user.value = storedUser
    }
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
    tokenData.value = null
    user.value = null
    error.value = null
  }

  // Initialize on store creation
  init()

  return {
    // State
    tokenData,
    user,
    loading,
    error,
    
    // Getters
    token,
    isAuthenticated,
    userName,
    userRole,
    userEmail,
    
    // Actions
    login,
    logout,
    init
  }
})