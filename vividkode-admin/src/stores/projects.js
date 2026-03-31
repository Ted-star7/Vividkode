// src/services/api/modules/projects.js
import apiClient from '../client'
import { API_ENDPOINTS } from '../endpoints'
import { useAuthStore } from '@/stores/authStore'

export const projectsApi = {

  /* =========================
     GET ALL PROJECTS
  ========================= */
  async getAll() {
    try {
      const authStore = useAuthStore()
      const response = await apiClient.get(API_ENDPOINTS.PROJECTS.LIST, {
        headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
      })
      return response
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      throw error
    }
  },

 // Stats
  async getStats() {
    try {
      const authStore = useAuthStore()
      const response = await apiClient.get(API_ENDPOINTS.PROJECTS.STATS, {
        headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
      })
      return response
    } catch (error) {
      console.error('Failed to fetch projects stats:', error)
      // return default stats 
      return {
        success: false,
        data: {
          totalProjects: 0,
          totalPublicProjects: 0,
          totalPendingProjects: 0,
          totalCompletedProjects: 0,
          totalPrivateProjects: 0
        },
        message: error.message
      }
    }
  },

  /// Get project by ID
  async getById(id) {
    try {
      const authStore = useAuthStore()
      const response = await apiClient.get(API_ENDPOINTS.PROJECTS.DETAIL(id), {
        headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
      })
      return response
    } catch (error) {
      console.error(`Failed to fetch project ${id}:`, error)
      throw error
    }
  },

  /* =========================
     CREATE PROJECT
  ========================= */
  async create(projectData, images = []) {
    try {
      const authStore = useAuthStore()
      const formData = new FormData()

      Object.entries(projectData).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      images.forEach((image, index) => {
        if (typeof image === 'string' && image.startsWith('data:image')) {
          formData.append('images', base64ToBlob(image), `image_${index}.jpg`)
        } else if (image instanceof File) {
          formData.append('images', image)
        }
      })

      const response = await apiClient.post(API_ENDPOINTS.PROJECTS.CREATE, formData, {
        headers: {
          Authorization: authStore.token ? `Bearer ${authStore.token}` : '',
          'Content-Type': 'multipart/form-data'
        }
      })

      return response
    } catch (error) {
      console.error('Failed to create project:', error)
      throw error
    }
  },

  /* =========================
     UPDATE PROJECT
  ========================= */
  async update(id, projectData, images = []) {
    try {
      const authStore = useAuthStore()
      const formData = new FormData()

      Object.entries(projectData).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      images.forEach((image, index) => {
        if (typeof image === 'string' && image.startsWith('data:image')) {
          formData.append('images', base64ToBlob(image), `image_${index}.jpg`)
        } else if (image instanceof File) {
          formData.append('images', image)
        }
      })

      const response = await apiClient.put(API_ENDPOINTS.PROJECTS.UPDATE(id), formData, {
        headers: {
          Authorization: authStore.token ? `Bearer ${authStore.token}` : '',
          'Content-Type': 'multipart/form-data'
        }
      })

      return response
    } catch (error) {
      console.error(`Failed to update project ${id}:`, error)
      throw error
    }
  },

  /* =========================
     DELETE PROJECT
  ========================= */
  async delete(id) {
    try {
      const authStore = useAuthStore()
      const response = await apiClient.delete(API_ENDPOINTS.PROJECTS.DELETE(id), {
        headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
      })
      return response
    } catch (error) {
      console.error(`Failed to delete project ${id}:`, error)
      throw error
    }
  }
}

/* =========================
   HELPER: BASE64 TO BLOB
========================= */
function base64ToBlob(base64) {
  const [header, data] = base64.split(';base64,')
  const contentType = header.split(':')[1]
  const raw = atob(data)
  const uInt8Array = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) uInt8Array[i] = raw.charCodeAt(i)
  return new Blob([uInt8Array], { type: contentType })
}