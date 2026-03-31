<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- Back Button -->
    <button @click="$router.back()" class="flex items-center gap-2 text-sm text-gray-400 hover:text-navy-800 transition-colors mb-6">
      ← Back to Projects
    </button>

    <div v-if="project" class="space-y-6">
      <!-- Header Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div :class="['h-3', getCategoryGradient(project.category)]"></div>
        <div class="p-6">
          <div class="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ project.category }}</span>
              </div>
              <h1 class="text-2xl font-bold text-navy-900">{{ project.title }}</h1>
              <p class="text-gray-500 mt-1">{{ project.client }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span :class="['px-2 py-1 rounded-full text-xs font-medium', project.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700']">
                {{ project.status }}
              </span>
              <span :class="['px-2 py-1 rounded-full text-xs font-medium', project.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600']">
                {{ project.published ? 'Published' : 'Draft' }}
              </span>
              <button @click="openEdit" class="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">✏️ Edit</button>
            </div>
          </div>

          <p class="text-sm text-gray-600 mt-4 leading-relaxed">{{ project.description }}</p>

          <div class="mt-5 flex flex-wrap gap-2">
            <span v-for="tech in project.techStack" :key="tech"
              class="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
              {{ tech }}
            </span>
          </div>
        </div>
      </div>

      <!-- Meta Info -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <div class="text-2xl mb-1">📅</div>
          <div class="text-xs text-gray-400">Created</div>
          <div class="text-sm font-semibold text-navy-800 mt-0.5">{{ project.createdAt || 'N/A' }}</div>
        </div>
        <div class="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <div class="text-2xl mb-1">🔄</div>
          <div class="text-xs text-gray-400">Last Updated</div>
          <div class="text-sm font-semibold text-navy-800 mt-0.5">{{ project.updatedAt || 'N/A' }}</div>
        </div>
        <div class="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <div class="text-2xl mb-1">{{ project.status === 'completed' ? '✅' : '🔄' }}</div>
          <div class="text-xs text-gray-400">Status</div>
          <div class="text-sm font-semibold text-navy-800 mt-0.5 capitalize">{{ project.status }}</div>
        </div>
        <div class="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
          <div class="text-2xl mb-1">{{ project.published ? '🌍' : '🔒' }}</div>
          <div class="text-xs text-gray-400">Visibility</div>
          <div class="text-sm font-semibold text-navy-800 mt-0.5">{{ project.published ? 'Public' : 'Private' }}</div>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 class="font-semibold text-navy-900 mb-4">Quick Actions</h3>
        <div class="flex flex-wrap gap-3">
          <button @click="togglePublish" class="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            {{ project.published ? '🔒 Unpublish' : '🌍 Publish Project' }}
          </button>
          <a v-if="project.link" :href="project.link" target="_blank" class="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            🔗 View Live Site
          </a>
          <button @click="toggleStatus" class="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            {{ project.status === 'ongoing' ? '✅ Mark Completed' : '🔄 Mark Ongoing' }}
          </button>
          <button @click="confirmDelete = true" class="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 ml-auto">
            🗑 Delete Project
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20 text-gray-400">
      <div class="text-5xl mb-4">🔍</div>
      <p class="font-medium text-lg">Project not found</p>
      <button @click="$router.push('/projects')" class="mt-4 px-4 py-2 bg-navy-900 text-white rounded-lg">Back to Projects</button>
    </div>

    <!-- Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showModal = false">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 class="text-lg font-bold text-navy-900">Edit Project</h2>
            <button @click="showModal = false" class="p-2 rounded-lg hover:bg-gray-100">✕</button>
          </div>
          <form @submit.prevent="saveEdit" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
              <input v-model="form.title" class="w-full px-4 py-2 border border-gray-200 rounded-lg" required />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Client</label>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea v-model="form.description" class="w-full px-4 py-2 border border-gray-200 rounded-lg min-h-24 resize-none"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tech Stack (comma-separated)</label>
              <input v-model="techStackInput" class="w-full px-4 py-2 border border-gray-200 rounded-lg" />
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
                <label class="block text-sm font-medium text-gray-700 mb-1">Live URL</label>
                <input v-model="form.link" class="w-full px-4 py-2 border border-gray-200 rounded-lg" type="url" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <input type="checkbox" v-model="form.published" id="pub" class="w-4 h-4 rounded" />
              <label for="pub" class="text-sm text-gray-700 font-medium">Published</label>
            </div>
            <div class="flex gap-3 pt-2">
              <button type="button" @click="showModal = false" class="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" class="flex-1 px-4 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirm -->
    <Teleport to="body">
      <div v-if="confirmDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="confirmDelete = false">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-2xl p-6 w-full max-w-sm text-center">
          <div class="text-4xl mb-3">🗑️</div>
          <h3 class="text-lg font-bold text-navy-900 mb-2">Delete Project?</h3>
          <p class="text-sm text-gray-500 mb-6">This will permanently remove this project. This cannot be undone.</p>
          <div class="flex gap-3">
            <button @click="confirmDelete = false" class="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
            <button @click="doDelete" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()

const project = computed(() => projectsStore.getById(route.params.id))
const showModal = ref(false)
const confirmDelete = ref(false)
const techStackInput = ref('')

const form = reactive({
  title: '',
  client: '',
  category: '',
  description: '',
  status: '',
  link: '',
  published: false
})

function getCategoryGradient(cat) {
  const gradients = {
    'Web Development': 'bg-gradient-to-r from-navy-700 to-navy-900',
    'Data Solutions': 'bg-gradient-to-r from-yellow-600 to-yellow-700',
    'Web Management': 'bg-gradient-to-r from-emerald-500 to-emerald-600'
  }
  return gradients[cat] || 'bg-navy-800'
}

function openEdit() {
  if (project.value) {
    Object.assign(form, { ...project.value })
    techStackInput.value = project.value.techStack?.join(', ') || ''
    showModal.value = true
  }
}

async function saveEdit() {
  await projectsStore.updateProject(project.value.id, {
    ...form,
    techStack: techStackInput.value.split(',').map(t => t.trim()).filter(Boolean)
  })
  showModal.value = false
}

async function togglePublish() {
  await projectsStore.togglePublish(project.value.id)
}

async function toggleStatus() {
  await projectsStore.toggleStatus(project.value.id)
}

async function doDelete() {
  await projectsStore.deleteProject(project.value.id)
  router.push('/projects')
}

onMounted(() => {
  projectsStore.fetchProjects()
})
</script>