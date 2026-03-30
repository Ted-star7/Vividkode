import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, cookieStorage } from '@/services'

export const useAuthStore = defineStore('auth', () => {

  /* =========================
     STATE
  ========================= */

  const token = ref(null)
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const initialized = ref(false)


  /* =========================
     GETTERS
  ========================= */

  const isAuthenticated = computed(() => {
    return !!token.value
  })

  const userName = computed(() => {
    if (!user.value) return 'Admin'

    if (user.value.name) return user.value.name

    if (user.value.email) {
      const emailName = user.value.email.split('@')[0]
      return emailName.charAt(0).toUpperCase() + emailName.slice(1)
    }

    return 'Admin'
  })


  /* =========================
     INIT AUTH FROM COOKIES
  ========================= */

  function init() {
    if (initialized.value) return

    const storedToken = cookieStorage.get('auth_token')
    const storedUser = cookieStorage.get('user_data')

    if (storedToken && validateToken(storedToken)) {
      token.value = storedToken
      user.value = storedUser
      console.log('Auth initialized from cookies')
    } else {
      clearAuth()
      console.log('No valid auth session')
    }

    initialized.value = true
  }


  /* =========================
     VALIDATE JWT TOKEN
  ========================= */

  function validateToken(jwt) {
    if (!jwt) return false

    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]))
      const exp = payload.exp

      if (!exp) return true

      const isExpired = Date.now() >= exp * 1000
      return !isExpired

    } catch (err) {
      console.warn('Token validation skipped')
      return true
    }
  }


  /* =========================
     LOGIN
  ========================= */

  async function login(credentials) {

    loading.value = true
    error.value = null

    try {

      const response = await authApi.login(credentials)

      if (!response.success) {
        throw new Error(response.message || 'Login failed')
      }

      const payload = response.data

      /* Save cookies */

      cookieStorage.set('auth_token', payload.token)

      cookieStorage.set('user_data', {
        id: payload.id,
        role: payload.role,
        name: payload.name,
        email: credentials.email
      })

      /* Update store */

      token.value = payload.token

      user.value = {
        id: payload.id,
        role: payload.role,
        name: payload.name,
        email: credentials.email
      }

      return {
        success: true,
        data: payload,
        message: response.message
      }

    } catch (err) {

      error.value = err.message || 'Login failed'

      return {
        success: false,
        error: error.value
      }

    } finally {
      loading.value = false
    }
  }


  /* =========================
     LOGOUT
  ========================= */

  function logout() {

    authApi.logout()

    clearAuth()
  }


  /* =========================
     CLEAR AUTH
  ========================= */

  function clearAuth() {

    token.value = null
    user.value = null

    cookieStorage.remove('auth_token')
    cookieStorage.remove('user_data')

    console.log('Auth cleared')
  }


  /* =========================
     INITIALIZE STORE
  ========================= */

  init()


  return {

    /* state */

    token,
    user,
    loading,
    error,
    initialized,

    /* getters */

    isAuthenticated,
    userName,

    /* actions */

    login,
    logout,
    init,
    clearAuth

  }

})