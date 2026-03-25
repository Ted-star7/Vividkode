<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h1 class="page-title">Projects</h1>
        <p class="text-sm text-gray-400 mt-0.5">{{ projectsStore.totalProjects }} projects total</p>
      </div>
      <button @click="openCreate" class="btn-primary">
        <span>＋</span> New Project
      </button>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-3 mb-5 flex-wrap">
      <div class="relative flex-1 min-w-48">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input v-model="search" placeholder="Search projects..." class="input-field pl-9" />
      </div>
      <select v-model="filterStatus" class="input-field w-auto px-3 py-2.5 text-sm">
        <option value="">All Status</option>
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
      </select>
      <select v-model="filterCategory" class="input-field w-auto px-3 py-2.5 text-sm">
        <option value="">All Categories</option>
        <option>Web Development</option>
        <option>Data Solutions</option>
        <option>Web Management</option>
      </select>
      <div class="flex rounded-lg border border-gray-200 overflow-hidden">
        <button @click="viewMode = 'grid'" :class="['px-3 py-2 text-sm transition-colors', viewMode === 'grid' ? 'bg-navy-900 text-white' : 'text-gray-500 hover:bg-gray-50']">⊞</button>
        <button @click="viewMode = 'list'" :class="['px-3 py-2 text-sm transition-colors', viewMode === 'list' ? 'bg-navy-900 text-white' : 'text-gray-500 hover:bg-gray-50']">☰</button>
      </div>
    </div>

    <!-- Grid View -->
    <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div v-for="project in filteredProjects" :key="project.id"
        class="card-hover group cursor-pointer"
        @click="$router.push(`/projects/${project.id}`)">
        <!-- Color header -->
        <div :class="['h-2 rounded-t-xl', getCategoryGradient(project.category)]"></div>
        <div class="p-5">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-navy-800 text-sm leading-snug group-hover:text-navy-900 truncate">{{ project.title }}</h3>
              <p class="text-xs text-gray-400 mt-0.5">{{ project.client }}</p>
            </div>
            <div class="flex items-center gap-1.5 ml-2 shrink-0" @click.stop>
              <span :class="['badge text-[10px]', project.status === 'completed' ? 'badge-green' : 'badge-gold']">{{ project.status }}</span>
            </div>
          </div>
          <p class="text-xs text-gray-500 line-clamp-2 mb-4">{{ project.description }}</p>
          <div class="flex flex-wrap gap-1 mb-4">
            <span v-for="tech in project.techStack.slice(0,3)" :key="tech" class="text-[10px] bg-navy-50 text-navy-600 px-2 py-0.5 rounded font-medium">{{ tech }}</span>
            <span v-if="project.techStack.length > 3" class="text-[10px] text-gray-400">+{{ project.techStack.length - 3 }}</span>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-gray-100">
            <div class="flex items-center gap-2">
              <span :class="['w-1.5 h-1.5 rounded-full', project.published ? 'bg-emerald-400' : 'bg-gray-300']"></span>
              <span class="text-[10px] text-gray-400">{{ project.published ? 'Published' : 'Draft' }}</span>
            </div>
            <div class="flex items-center gap-1" @click.stop>
              <button @click="togglePublish(project)" class="btn-ghost px-2 py-1 text-[11px]">{{ project.published ? 'Unpublish' : 'Publish' }}</button>
              <button @click="openEdit(project)" class="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-navy-700 transition-colors text-sm">✏️</button>
              <button @click="confirmDelete(project)" class="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors text-sm">🗑</button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="filteredProjects.length === 0" class="col-span-3 text-center py-16 text-gray-400">
        <div class="text-4xl mb-3">📁</div>
        <p class="font-medium">No projects found</p>
        <p class="text-sm mt-1">Try adjusting your filters</p>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="card overflow-hidden">
      <table class="w-full">
        <thead>
          <tr>
            <th class="table-header rounded-tl-xl">Project</th>
            <th class="table-header">Category</th>
            <th class="table-header">Status</th>
            <th class="table-header">Published</th>
            <th class="table-header">Updated</th>
            <th class="table-header rounded-tr-xl">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in filteredProjects" :key="project.id" class="table-row cursor-pointer" @click="$router.push(`/projects/${project.id}`)">
            <td class="table-cell">
              <div class="font-medium text-navy-800">{{ project.title }}</div>
              <div class="text-xs text-gray-400">{{ project.client }}</div>
            </td>
            <td class="table-cell text-xs text-gray-500">{{ project.category }}</td>
            <td class="table-cell">
              <span :class="['badge text-[10px]', project.status === 'completed' ? 'badge-green' : 'badge-gold']">{{ project.status }}</span>
            </td>
            <td class="table-cell">
              <span :class="['badge text-[10px]', project.published ? 'badge-green' : 'badge-gray']">{{ project.published ? 'Live' : 'Draft' }}</span>
            </td>
            <td class="table-cell text-xs text-gray-400">{{ project.updatedAt }}</td>
            <td class="table-cell" @click.stop>
              <div class="flex items-center gap-1">
                <button @click="openEdit(project)" class="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-navy-700 transition-colors">✏️</button>
                <button @click="confirmDelete(project)" class="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">🗑</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredProjects.length === 0" class="text-center py-12 text-gray-400">
        <p>No projects found</p>
      </div>
    </div>

    <!-- Project Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showModal = false">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div class="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 class="font-display text-lg font-bold text-navy-900">{{ isEditing ? 'Edit Project' : 'New Project' }}</h2>
              <button @click="showModal = false" class="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">✕</button>
            </div>
            <form @submit.prevent="saveProject" class="p-6 space-y-4">
              <div>
                <label class="label">Project Title *</label>
                <input v-model="form.title" class="input-field" placeholder="e.g. TechNova E-Commerce Platform" required />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="label">Client Name</label>
                  <input v-model="form.client" class="input-field" placeholder="Client or Company" />
                </div>
                <div>
                  <label class="label">Category</label>
                  <select v-model="form.category" class="input-field">
                    <option>Web Development</option>
                    <option>Data Solutions</option>
                    <option>Web Management</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="label">Description *</label>
                <textarea v-model="form.description" class="input-field min-h-24 resize-none" placeholder="Project description..." required></textarea>
              </div>
              <div>
                <label class="label">Tech Stack (comma-separated)</label>
                <input v-model="techStackInput" class="input-field" placeholder="Vue 3, Node.js, PostgreSQL" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="label">Status</label>
                  <select v-model="form.status" class="input-field">
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label class="label">Project Link</label>
                  <input v-model="form.link" class="input-field" placeholder="https://" type="url" />
                </div>
              </div>
              <div class="flex items-center gap-3 pt-1">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="form.published" class="w-4 h-4 rounded accent-navy-900" />
                  <span class="text-sm text-navy-700 font-medium">Publish to portfolio</span>
                </label>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" @click="showModal = false" class="btn-outline flex-1">Cancel</button>
                <button type="submit" class="btn-primary flex-1" :disabled="projectsStore.loading">
                  <span v-if="projectsStore.loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  {{ isEditing ? 'Save Changes' : 'Create Project' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirm -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="deleteTarget = null">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div class="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-scale-in text-center">
            <div class="text-4xl mb-3">🗑️</div>
            <h3 class="font-display text-lg font-bold text-navy-900 mb-2">Delete Project?</h3>
            <p class="text-sm text-gray-500 mb-6">This will permanently delete "<strong>{{ deleteTarget?.title }}</strong>". This cannot be undone.</p>
            <div class="flex gap-3">
              <button @click="deleteTarget = null" class="btn-outline flex-1">Cancel</button>
              <button @click="doDelete" class="btn-danger flex-1">Delete</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useProjectsStore } from '@/stores/projects'

const projectsStore = useProjectsStore()
const search = ref('')
const filterStatus = ref('')
const filterCategory = ref('')
const viewMode = ref('grid')
const showModal = ref(false)
const isEditing = ref(false)
const deleteTarget = ref(null)
const techStackInput = ref('')

const form = reactive({ title: '', client: '', category: 'Web Development', description: '', status: 'ongoing', link: '', published: false })

const filteredProjects = computed(() => {
  return projectsStore.projects.filter(p => {
    const matchSearch = !search.value || p.title.toLowerCase().includes(search.value.toLowerCase()) || p.client?.toLowerCase().includes(search.value.toLowerCase())
    const matchStatus = !filterStatus.value || p.status === filterStatus.value
    const matchCat = !filterCategory.value || p.category === filterCategory.value
    return matchSearch && matchStatus && matchCat
  })
})

function getCategoryGradient(cat) {
  return { 'Web Development': 'bg-gradient-to-r from-navy-700 to-navy-900', 'Data Solutions': 'bg-gradient-to-r from-gold-500 to-gold-600', 'Web Management': 'bg-gradient-to-r from-emerald-500 to-emerald-600' }[cat] || 'bg-navy-800'
}

function openCreate() {
  isEditing.value = false
  Object.assign(form, { title: '', client: '', category: 'Web Development', description: '', status: 'ongoing', link: '', published: false })
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
  const data = { ...form, techStack: techStackInput.value.split(',').map(t => t.trim()).filter(Boolean) }
  if (isEditing.value) { await projectsStore.updateProject(form.id, data) }
  else { await projectsStore.createProject(data) }
  showModal.value = false
}

function confirmDelete(project) { deleteTarget.value = project }
async function doDelete() { await projectsStore.deleteProject(deleteTarget.value.id); deleteTarget.value = null }

async function togglePublish(project) { await projectsStore.togglePublish(project.id) }
</script>

<style scoped>
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
