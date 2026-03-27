<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h1 class="text-2xl font-bold text-navy-900">Projects</h1>
        <p class="text-sm text-gray-400 mt-0.5">{{ projectsStore.totalProjects }} projects total</p>
      </div>
      <button @click="openCreate" class="px-4 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800 transition-colors">
        <span>＋</span> New Project
      </button>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-3 mb-5 flex-wrap">
      <div class="relative flex-1 min-w-48">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input 
          v-model="search" 
          placeholder="Search projects..." 
          class="w-full px-4 py-2 pl-9 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900/20"
        />
      </div>
      <select v-model="filterStatus" class="px-3 py-2 border border-gray-200 rounded-lg text-sm">
        <option value="">All Status</option>
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
      </select>
      <select v-model="filterCategory" class="px-3 py-2 border border-gray-200 rounded-lg text-sm">
        <option value="">All Categories</option>
        <option>Web Development</option>
        <option>Data Solutions</option>
        <option>Web Management</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="projectsStore.loading" class="text-center py-12">
      <div class="inline-block w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-gray-400 mt-2">Loading projects...</p>
    </div>

    <!-- Projects Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div 
        v-for="project in filteredProjects" 
        :key="project.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
        @click="$router.push(`/projects/${project.id}`)"
      >
        <div :class="['h-2 rounded-t-xl', getCategoryGradient(project.category)]"></div>
        <div class="p-5">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-navy-800 text-sm truncate">{{ project.title }}</h3>
              <p class="text-xs text-gray-400 mt-0.5">{{ project.client }}</p>
            </div>
            <span :class="['px-2 py-1 rounded-full text-[10px] font-medium', project.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700']">
              {{ project.status }}
            </span>
          </div>
          <p class="text-xs text-gray-500 line-clamp-2 mb-4">{{ project.description }}</p>
          <div class="flex flex-wrap gap-1 mb-4">
            <span v-for="tech in project.techStack?.slice(0,3)" :key="tech" class="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {{ tech }}
            </span>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-gray-100">
            <div class="flex items-center gap-2">
              <span :class="['w-1.5 h-1.5 rounded-full', project.published ? 'bg-green-400' : 'bg-gray-300']"></span>
              <span class="text-[10px] text-gray-400">{{ project.published ? 'Published' : 'Draft' }}</span>
            </div>
            <div class="flex items-center gap-1" @click.stop>
              <button @click="openEdit(project)" class="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-navy-700">✏️</button>
              <button @click="confirmDelete(project)" class="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600">🗑</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredProjects.length === 0" class="col-span-3 text-center py-16 text-gray-400">
        <div class="text-4xl mb-3">📁</div>
        <p class="font-medium">No projects found</p>
      </div>
    </div>

    <!-- Modal for Create/Edit -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showModal = false">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 class="text-lg font-bold text-navy-900">{{ isEditing ? 'Edit Project' : 'New Project' }}</h2>
            <button @click="showModal = false" class="p-2 rounded-lg hover:bg-gray-100">✕</button>
          </div>
          <form @submit.prevent="saveProject" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
              <input v-model="form.title" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900/20" required />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input v-model="form.client" class="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select v-model="form.category" class="w-full px-4 py-2 border border-gray-200 rounded-lg">
                  <option>Web Development</option>
                  <option>Data Solutions</option>
                  <option>Web Management</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea v-model="form.description" class="w-full px-4 py-2 border border-gray-200 rounded-lg min-h-24 resize-none" required></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tech Stack (comma-separated)</label>
              <input v-model="techStackInput" class="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="Vue 3, Node.js, PostgreSQL" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select v-model="form.status" class="w-full px-4 py-2 border border-gray-200 rounded-lg">
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Project Link</label>
                <input v-model="form.link" class="w-full px-4 py-2 border border-gray-200 rounded-lg" placeholder="https://" type="url" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <input type="checkbox" v-model="form.published" id="publish" class="w-4 h-4 rounded" />
              <label for="publish" class="text-sm text-gray-700">Publish to portfolio</label>
            </div>
            <div class="flex gap-3 pt-2">
              <button type="button" @click="showModal = false" class="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" class="flex-1 px-4 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800" :disabled="projectsStore.loading">
                {{ projectsStore.loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Project') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="deleteTarget = null">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-2xl p-6 w-full max-w-sm text-center">
          <div class="text-4xl mb-3">🗑️</div>
          <h3 class="text-lg font-bold text-navy-900 mb-2">Delete Project?</h3>
          <p class="text-sm text-gray-500 mb-6">This will permanently delete "<strong>{{ deleteTarget?.title }}</strong>". This cannot be undone.</p>
          <div class="flex gap-3">
            <button @click="deleteTarget = null" class="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button @click="doDelete" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useProjectsStore } from '@/stores/projects'

const projectsStore = useProjectsStore()
const search = ref('')
const filterStatus = ref('')
const filterCategory = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const deleteTarget = ref(null)
const techStackInput = ref('')

const form = reactive({
  title: '',
  client: '',
  category: 'Web Development',
  description: '',
  status: 'ongoing',
  link: '',
  published: false
})

const filteredProjects = computed(() => {
  return projectsStore.projects.filter(p => {
    const matchSearch = !search.value || 
      p.title?.toLowerCase().includes(search.value.toLowerCase()) || 
      p.client?.toLowerCase().includes(search.value.toLowerCase())
    const matchStatus = !filterStatus.value || p.status === filterStatus.value
    const matchCat = !filterCategory.value || p.category === filterCategory.value
    return matchSearch && matchStatus && matchCat
  })
})

function getCategoryGradient(cat) {
  const gradients = {
    'Web Development': 'bg-gradient-to-r from-navy-700 to-navy-900',
    'Data Solutions': 'bg-gradient-to-r from-yellow-600 to-yellow-700',
    'Web Management': 'bg-gradient-to-r from-emerald-500 to-emerald-600'
  }
  return gradients[cat] || 'bg-navy-800'
}

function openCreate() {
  isEditing.value = false
  Object.assign(form, {
    title: '',
    client: '',
    category: 'Web Development',
    description: '',
    status: 'ongoing',
    link: '',
    published: false
  })
  techStackInput.value = ''
  showModal.value = true
}

function openEdit(project) {
  isEditing.value = true
  Object.assign(form, { ...project })
  techStackInput.value = project.techStack?.join(', ') || ''
  showModal.value = true
}

async function saveProject() {
  const data = {
    ...form,
    techStack: techStackInput.value.split(',').map(t => t.trim()).filter(Boolean)
  }
  
  if (isEditing.value) {
    await projectsStore.updateProject(form.id, data)
  } else {
    await projectsStore.createProject(data)
  }
  showModal.value = false
}

function confirmDelete(project) {
  deleteTarget.value = project
}

async function doDelete() {
  await projectsStore.deleteProject(deleteTarget.value.id)
  deleteTarget.value = null
}

onMounted(() => {
  projectsStore.fetchProjects()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>