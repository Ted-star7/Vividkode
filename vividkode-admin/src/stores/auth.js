// stores/auth.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '@/services/api/modules/auth';
import { localStorageService } from "@/services/storage/local";

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
   * Sync current state to localStorage (persistence)
   */
  function _syncToLocalStorage() {
    if (token.value && user.value) {
      localStorageService.set('auth_token', token.value);
      localStorageService.set('user_data', user.value);
    } else {
      localStorageService.remove('auth_token');
      localStorageService.remove('user_data');
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
      const base64Url = jwt.split('.')[1];
      if (!base64Url) return false;

      // JWT payload is base64url encoded (not plain base64)
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      const payload = JSON.parse(atob(padded));
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
   * Initialize auth from localStorage (call on app startup)
   */
  function init() {
    if (initialized.value) return;

    const storedToken = localStorageService.get('auth_token');
    const storedUser = localStorageService.get('user_data');

    if (storedToken && storedUser && validateToken(storedToken)) {
      token.value = storedToken;
      user.value = storedUser;
      console.log('✅ Auth initialized from localStorage');
    } else {
      // Clear invalid data
      if (storedToken || storedUser) {
        localStorageService.remove('auth_token');
        localStorageService.remove('user_data');
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
      
      // Sync to localStorage
      _syncToLocalStorage();

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
    
    // Clear localStorage
    localStorageService.remove('auth_token');
    localStorageService.remove('user_data');
    
    // Call logout API (optional)
    await authApi.logout().catch(console.error);
    
    console.log('✅ Logged out');
  }

  /**
   * Clear all auth data
   */
  function clearAuth() {
    _clearState();
    localStorageService.remove('auth_token');
    localStorageService.remove('user_data');
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
        _syncToLocalStorage();
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