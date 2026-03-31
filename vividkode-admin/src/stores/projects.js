import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { projectsApi } from '@/services/api/modules/projects'

function toArray(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.projects)) return data.projects
  return []
}

function normalizeId(id) {
  if (id === null || id === undefined) return null
  return String(id)
}

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([])
  const stats = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const totalProjects = computed(() => projects.value.length)

  function getById(id) {
    const nid = normalizeId(id)
    return projects.value.find((p) => normalizeId(p?.id) === nid) || null
  }

  async function fetchProjects() {
    loading.value = true
    error.value = null
    try {
      const response = await projectsApi.getAll()
      const next = toArray(response?.data ?? response)
      projects.value = next
      return response
    } catch (e) {
      error.value = e?.message || 'Failed to fetch projects'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    try {
      const response = await projectsApi.getStats()
      stats.value = response?.data ?? response?.data?.data ?? response?.data?.stats ?? response?.data ?? response
      return response
    } catch (e) {
      stats.value = {
        totalProjects: 0,
        totalPublicProjects: 0,
        totalPendingProjects: 0,
        totalCompletedProjects: 0,
        totalPrivateProjects: 0,
      }
      return { success: false, data: stats.value, message: e?.message }
    }
  }

  async function createProject(projectData, images = []) {
    loading.value = true
    error.value = null
    try {
      const response = await projectsApi.create(projectData, images)
      await Promise.all([fetchProjects(), fetchStats()])
      return response
    } catch (e) {
      error.value = e?.message || 'Failed to create project'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateProject(id, projectData, images = []) {
    loading.value = true
    error.value = null
    try {
      const response = await projectsApi.update(id, projectData, images)
      await Promise.all([fetchProjects(), fetchStats()])
      return response
    } catch (e) {
      error.value = e?.message || 'Failed to update project'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteProject(id) {
    loading.value = true
    error.value = null
    try {
      const response = await projectsApi.delete(id)
      await Promise.all([fetchProjects(), fetchStats()])
      return response
    } catch (e) {
      error.value = e?.message || 'Failed to delete project'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function togglePublish(id) {
    const project = getById(id)
    if (!project) return null
    return updateProject(id, { ...project, published: !project.published })
  }

  async function toggleStatus(id) {
    const project = getById(id)
    if (!project) return null
    const nextStatus = project.status === 'public' ? 'private' : 'public'
    return updateProject(id, { ...project, status: nextStatus })
  }

  function getMonthlyActivityData(year = new Date().getFullYear()) {
    const months = Array.from({ length: 12 }, () => 0)
    for (const p of projects.value) {
      const raw = p?.createdAt || p?.created_at || p?.created || p?.date || p?.updatedAt || p?.updated_at
      const d = raw ? new Date(raw) : null
      if (!d || Number.isNaN(d.getTime())) continue
      if (d.getFullYear() !== year) continue
      months[d.getMonth()] += 1
    }
    return months
  }

  return {
    projects,
    stats,
    loading,
    error,
    totalProjects,
    getById,
    fetchProjects,
    fetchStats,
    createProject,
    updateProject,
    deleteProject,
    togglePublish,
    toggleStatus,
    getMonthlyActivityData,
  }
})