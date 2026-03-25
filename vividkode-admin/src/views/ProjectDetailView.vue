<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- Back -->
    <button @click="$router.back()" class="flex items-center gap-2 text-sm text-gray-400 hover:text-navy-800 transition-colors mb-6">
      ← Back to Projects
    </button>

    <div v-if="project" class="space-y-6 animate-fade-in">
      <!-- Header card -->
      <div class="card overflow-hidden">
        <div :class="['h-3', getCategoryGradient(project.category)]"></div>
        <div class="p-6">
          <div class="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ project.category }}</span>
              </div>
              <h1 class="font-display text-2xl font-bold text-navy-900">{{ project.title }}</h1>
              <p class="text-gray-500 mt-1">{{ project.client }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span :class="['badge', project.status === 'completed' ? 'badge-green' : 'badge-gold']">{{ project.status }}</span>
              <span :class="['badge', project.published ? 'badge-navy' : 'badge-gray']">{{ project.published ? '🟢 Published' : '⚫ Draft' }}</span>
              <button @click="openEdit" class="btn-outline">✏️ Edit</button>
            </div>
          </div>

          <p class="text-sm text-gray-600 mt-4 leading-relaxed">{{ project.description }}</p>

          <div class="mt-5 flex flex-wrap gap-2">
            <span v-for="tech in project.techStack" :key="tech"
              class="text-xs bg-navy-50 text-navy-700 px-3 py-1 rounded-full font-medium border border-navy-100">{{ tech }}</span>
          </div>
        </div>
      </div>

      <!-- Meta -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="card p-4 text-center">
          <div class="text-2xl mb-1">📅</div>
          <div class="text-xs text-gray-400">Created</div>
          <div class="text-sm font-semibold text-navy-800 mt-0.5">{{ project.createdAt }}</div>
        </div>
        <div class="card p-4 text-center">
          <div class="text-2xl mb-1">🔄</div>
          <div class="text-xs text-gray-400">Last Updated</div>
          <div class="text-sm font-semibold text-navy-800 mt-0.5">{{ project.updatedAt }}</div>
        </div>
        <div class="card p-4 text-center">
          <div class="text-2xl mb-1">{{ project.status === 'completed' ? '✅' : '🔄' }}</div>
          <div class="text-xs text-gray-400">Status</div>
          <div class="text-sm font-semibold text-navy-800 mt-0.5 capitalize">{{ project.status }}</div>
        </div>
        <div class="card p-4 text-center">
          <div class="text-2xl mb-1">{{ project.published ? '🌍' : '🔒' }}</div>
          <div class="text-xs text-gray-400">Visibility</div>
          <div class="text-sm font-semibold text-navy-800 mt-0.5">{{ project.published ? 'Public' : 'Private' }}</div>
        </div>
      </div>

      <!-- Actions -->
      <div class="card p-5">
        <h3 class="section-title mb-4">Quick Actions</h3>
        <div class="flex flex-wrap gap-3">
          <button @click="togglePublish" class="btn-outline">
            {{ project.published ? '🔒 Unpublish' : '🌍 Publish Project' }}
          </button>
          <a v-if="project.link" :href="project.link" target="_blank" class="btn-outline">
            🔗 View Live Site
          </a>
          <button @click="toggleStatus" class="btn-outline">
            {{ project.status === 'ongoing' ? '✅ Mark Completed' : '🔄 Mark Ongoing' }}
          </button>
          <button @click="confirmDelete = true" class="btn-danger ml-auto">
            🗑 Delete Project
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20 text-gray-400">
      <div class="text-5xl mb-4">🔍</div>
      <p class="font-medium text-lg">Project not found</p>
      <button @click="$router.push('/projects')" class="btn-primary mt-4">Back to Projects</button>
    </div>

    <!-- Edit Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showModal = false">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div class="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 class="font-display text-lg font-bold text-navy-900">Edit Project</h2>
              <button @click="showModal = false" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">✕</button>
            </div>
            <form @submit.prevent="saveEdit" class="p-6 space-y-4">
              <div>
                <label class="label">Project Title *</label>
                <input v-model="form.title" class="input-field" required />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="label">Client</label>
                  <input v-model="form.client" class="input-field" />
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
                <label class="label">Description</label>
                <textarea v-model="form.description" class="input-field min-h-24 resize-none"></textarea>
              </div>
              <div>
                <label class="label">Tech Stack (comma-separated)</label>
                <input v-model="techStackInput" class="input-field" />
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
                  <label class="label">Live URL</label>
                  <input v-model="form.link" class="input-field" type="url" placeholder="https://" />
                </div>
              </div>
              <div class="flex items-center gap-2">
                <input type="checkbox" v-model="form.published" id="pub" class="w-4 h-4 rounded accent-navy-900" />
                <label for="pub" class="text-sm text-navy-700 font-medium cursor-pointer">Published</label>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" @click="showModal = false" class="btn-outline flex-1">Cancel</button>
                <button type="submit" class="btn-primary flex-1">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete confirm -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="confirmDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="confirmDelete = false">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div class="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-scale-in text-center">
            <div class="text-4xl mb-3">🗑️</div>
            <h3 class="font-display text-lg font-bold text-navy-900 mb-2">Delete Project?</h3>
            <p class="text-sm text-gray-500 mb-6">This will permanently remove this project. This cannot be undone.</p>
            <div class="flex gap-3">
              <button @click="confirmDelete = false" class="btn-outline flex-1">Cancel</button>
              <button @click="doDelete" class="btn-danger flex-1">Delete</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()

const project = computed(() => projectsStore.getById(route.params.id))
const showModal = ref(false)
const confirmDelete = ref(false)
const form = reactive({})
const techStackInput = ref('')

function getCategoryGradient(cat) {
  return { 'Web Development': 'bg-gradient-to-r from-navy-700 to-navy-900', 'Data Solutions': 'bg-gradient-to-r from-gold-500 to-gold-600', 'Web Management': 'bg-gradient-to-r from-emerald-500 to-emerald-600' }[cat] || 'bg-navy-800'
}

function openEdit() {
  Object.assign(form, { ...project.value })
  techStackInput.value = project.value.techStack?.join(', ') || ''
  showModal.value = true
}

async function saveEdit() {
  await projectsStore.updateProject(project.value.id, {
    ...form,
    techStack: techStackInput.value.split(',').map(t => t.trim()).filter(Boolean)
  })
  showModal.value = false
}

async function togglePublish() { await projectsStore.togglePublish(project.value.id) }

async function toggleStatus() {
  await projectsStore.updateProject(project.value.id, {
    status: project.value.status === 'ongoing' ? 'completed' : 'ongoing'
  })
}

async function doDelete() {
  await projectsStore.deleteProject(project.value.id)
  router.push('/projects')
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
