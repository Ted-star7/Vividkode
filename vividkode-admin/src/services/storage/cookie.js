import Cookies from 'js-cookie';

export const cookieStorage = {

  /**
   * Set a cookie
   * @param {string} key
   * @param {any} value
   * @param {object} options
   */
  set(key, value, options = {}) {
    try {
      const defaultOptions = {
        expires: 7, // days
        path: '/',
        secure: window.location.protocol === 'https:', // works for localhost + production
        sameSite: 'Lax', // safer for APIs
      };

      const cookieValue =
        typeof value === 'object'
          ? JSON.stringify(value)
          : value;

      Cookies.set(key, cookieValue, {
        ...defaultOptions,
        ...options,
      });

    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  },

  /**
   * Get a cookie
   * @param {string} key
   */
  get(key) {
    try {
      const value = Cookies.get(key);

      if (!value) return null;

      try {
        return JSON.parse(value);
      } catch {
        return value;
      }

    } catch (error) {
      console.error('Error reading cookie:', error);
      return null;
    }
  },

  /**
   * Remove cookie
   */
  remove(key) {
    try {
      Cookies.remove(key, { path: '/' });
    } catch (error) {
      console.error('Error removing cookie:', error);
    }
  },

  /**
   * Clear all cookies
   */
  clear() {
    try {
      const cookies = Cookies.get();

      Object.keys(cookies).forEach((key) => {
        Cookies.remove(key, { path: '/' });
      });

    } catch (error) {
      console.error('Error clearing cookies:', error);
    }
  },

  /**
   * Check if cookie exists
   */
  exists(key) {
    return Cookies.get(key) !== undefined;
  }

};