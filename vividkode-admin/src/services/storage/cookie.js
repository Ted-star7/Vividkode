import Cookies from 'js-cookie';

export const cookieStorage = {
  /**
   * Set a cookie
   * @param {string} key - Cookie key
   * @param {any} value - Value to store
   * @param {object} options - Cookie options
   */
  set(key, value, options = {}) {
    const defaultOptions = {
      expires: 7, // Default to 7 days
      path: '/',
      secure: true, // Only send over HTTPS
      sameSite: 'Strict', // CSRF protection
    };
    
    // Stringify the value if it's an object
    const stringValue = typeof value === 'object' 
      ? JSON.stringify(value) 
      : value;
    
    Cookies.set(key, stringValue, { ...defaultOptions, ...options });
  },
  
  /**
   * Get a cookie value
   * @param {string} key - Cookie key
   * @returns {any} - Parsed value
   */
  get(key) {
    const value = Cookies.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },
  
  /**
   * Remove a cookie
   * @param {string} key - Cookie key
   */
  remove(key) {
    Cookies.remove(key, { path: '/' });
  },
  
  /**
   * Clear all cookies
   */
  clear() {
    const allCookies = Cookies.get();
    Object.keys(allCookies).forEach(key => {
      this.remove(key);
    });
  },
  
  /**
   * Check if cookie exists
   * @param {string} key - Cookie key
   * @returns {boolean}
   */
  exists(key) {
    return !!Cookies.get(key);
  }
};