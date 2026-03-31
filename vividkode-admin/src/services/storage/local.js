export const localStorageService = {
  set(key, value) {
    try {
      const raw = typeof value === 'string' ? value : JSON.stringify(value)
      window.localStorage.setItem(key, raw)
    } catch (error) {
      console.error('Error writing localStorage:', error)
    }
  },

  get(key) {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw === null) return null
      try {
        return JSON.parse(raw)
      } catch {
        return raw
      }
    } catch (error) {
      console.error('Error reading localStorage:', error)
      return null
    }
  },

  remove(key) {
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing localStorage key:', error)
    }
  },
}

export default localStorageService
