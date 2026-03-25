import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('vk_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('vk_user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)
  const isSuperAdmin = computed(() => user.value?.role === 'super_admin')

  // Mock users
  const MOCK_USERS = [
    { id: 1, name: 'Alex Morgan', email: 'admin@vividkode.com', password: 'admin123', role: 'super_admin', avatar: 'AM' },
    { id: 2, name: 'Jordan Lee', email: 'editor@vividkode.com', password: 'editor123', role: 'editor', avatar: 'JL' },
  ]

  async function login(email, password) {
    await new Promise(r => setTimeout(r, 800)) // Simulate API
    const found = MOCK_USERS.find(u => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid credentials')
    const { password: _, ...userData } = found
    const mockToken = btoa(JSON.stringify({ id: userData.id, exp: Date.now() + 86400000 }))
    token.value = mockToken
    user.value = userData
    localStorage.setItem('vk_token', mockToken)
    localStorage.setItem('vk_user', JSON.stringify(userData))
    return userData
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('vk_token')
    localStorage.removeItem('vk_user')
  }

  return { token, user, isAuthenticated, isSuperAdmin, login, logout }
})
