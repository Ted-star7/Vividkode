// stores/auth.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '@/services/api/modules/auth';
import { cookieStorage } from "@/services/storage/cookie";

export const useAuthStore = defineStore('auth', () => {

  
  const token = ref(null);
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const initialized = ref(false);

  /* =========================
     GETTERS
  ========================= */
  const isAuthenticated = computed(() => !!token.value);

  const userName = computed(() => {
    if (!user.value) return 'Admin';
    if (user.value.name) return user.value.name;
    if (user.value.email) {
      const emailName = user.value.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return 'Admin';
  });

  const userRole = computed(() => user.value?.role || null);
  const userId = computed(() => user.value?.id || null);
  const userEmail = computed(() => user.value?.email || null);

  /* =========================
     PRIVATE METHODS
  ========================= */

  /**
   * Sync current state to cookies (persistence)
   */
  function _syncToCookies() {
    if (token.value && user.value) {
      cookieStorage.set('auth_token', token.value);
      cookieStorage.set('user_data', user.value);
    } else {
      cookieStorage.remove('auth_token');
      cookieStorage.remove('user_data');
    }
  }

  /**
   * Clear all state
   */
  function _clearState() {
    token.value = null;
    user.value = null;
    error.value = null;
  }

  /**
   * Validate JWT token
   */
  function validateToken(jwt) {
    if (!jwt) return false;

    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      const exp = payload.exp;

      if (!exp) return true;

      const isExpired = Date.now() >= exp * 1000;
      return !isExpired;

    } catch (err) {
      console.warn('Token validation failed:', err);
      return false;
    }
  }

  /* =========================
     PUBLIC METHODS
  ========================= */

  /**
   * Initialize auth from cookies (call on app startup)
   */
  function init() {
    if (initialized.value) return;

    const storedToken = cookieStorage.get('auth_token');
    const storedUser = cookieStorage.get('user_data');

    if (storedToken && storedUser && validateToken(storedToken)) {
      token.value = storedToken;
      user.value = storedUser;
      console.log('✅ Auth initialized from cookies');
    } else {
      // Clear invalid data
      if (storedToken || storedUser) {
        cookieStorage.remove('auth_token');
        cookieStorage.remove('user_data');
      }
      console.log('⚠️ No valid auth session');
    }

    initialized.value = true;
  }

  /**
   * Login user
   */
  async function login(credentials) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authApi.login(credentials);

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const { token: newToken, user: userData } = response.data;

      // Update state
      token.value = newToken;
      user.value = userData;
      
      // Sync to cookies
      _syncToCookies();

      return {
        success: true,
        data: response.data,
        message: response.message
      };

    } catch (err) {
      error.value = err.message || 'Login failed';
      return {
        success: false,
        error: error.value
      };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Logout user
   */
  async function logout() {
    // Clear state first
    _clearState();
    
    // Clear cookies
    cookieStorage.remove('auth_token');
    cookieStorage.remove('user_data');
    
    // Call logout API (optional)
    await authApi.logout().catch(console.error);
    
    console.log('✅ Logged out');
  }

  /**
   * Clear all auth data
   */
  function clearAuth() {
    _clearState();
    cookieStorage.remove('auth_token');
    cookieStorage.remove('user_data');
    console.log('🧹 Auth cleared');
  }

  /**
   * Refresh user data from server
   */
  async function refreshUser() {
    if (!token.value) return null;

    try {
      const response = await authApi.getCurrentUser();
      if (response.success && response.data) {
        user.value = response.data;
        _syncToCookies();
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      return null;
    }
  }

  /* =========================
     INITIALIZE ON STORE CREATION
  ========================= */
  init();

  /* =========================
     RETURN STORE
  ========================= */
  return {
    // State
    token,
    user,
    loading,
    error,
    initialized,

    // Getters
    isAuthenticated,
    userName,
    userRole,
    userId,
    userEmail,

    // Actions
    login,
    logout,
    init,
    clearAuth,
    refreshUser,
    validateToken
  };
});