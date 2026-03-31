<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="page-title">Content Manager</h1>
      <p class="text-sm text-gray-400 mt-0.5">Manage company content for your public website</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 w-fit">
      <button v-for="tab in tabs" :key="tab.id"
        @click="activeTab = tab.id"
        :class="['px-5 py-2 text-sm font-medium rounded-lg transition-all', activeTab === tab.id ? 'bg-navy-900 text-white shadow-sm' : 'text-gray-500 hover:text-navy-700']">
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>

    <!-- Mission -->
    <Transition name="tab" mode="out-in">
      <div v-if="activeTab === 'mission'" key="mission" class="card p-6 animate-fade-in">
        <div class="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
          <div class="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center text-xl">🎯</div>
          <div>
            <h2 class="section-title">Mission Statement</h2>
            <p class="text-xs text-gray-400">Defines your company's purpose and what you strive to achieve</p>
          </div>
        </div>
        <label class="label">Mission</label>
        <textarea v-model="editMission" class="input-field min-h-36 resize-none leading-relaxed" placeholder="Your company mission..."></textarea>
        <div class="flex items-center justify-between mt-4">
          <span class="text-xs text-gray-400">{{ editMission.length }} characters</span>
          <div class="flex gap-2">
            <button @click="editMission = contentStore.content.mission" class="btn-outline">Reset</button>
            <button @click="save('mission', editMission)" class="btn-primary" :disabled="contentStore.saving">
              <span v-if="contentStore.saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ contentStore.saving ? 'Saving...' : 'Save Mission' }}
            </button>
          </div>
        </div>
        <div v-if="savedSection === 'mission'" class="mt-3 flex items-center gap-2 text-emerald-600 text-sm">
          <span>✓</span> Saved successfully
        </div>
      </div>

      <!-- Vision -->
      <div v-else-if="activeTab === 'vision'" key="vision" class="card p-6 animate-fade-in">
        <div class="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
          <div class="w-10 h-10 bg-gold-50 rounded-xl flex items-center justify-center text-xl">🔭</div>
          <div>
            <h2 class="section-title">Vision Statement</h2>
            <p class="text-xs text-gray-400">Where you see your company going in the future</p>
          </div>
        </div>
        <label class="label">Vision</label>
        <textarea v-model="editVision" class="input-field min-h-36 resize-none leading-relaxed" placeholder="Your company vision..."></textarea>
        <div class="flex items-center justify-between mt-4">
          <span class="text-xs text-gray-400">{{ editVision.length }} characters</span>
          <div class="flex gap-2">
            <button @click="editVision = contentStore.content.vision" class="btn-outline">Reset</button>
            <button @click="save('vision', editVision)" class="btn-primary" :disabled="contentStore.saving">
              <span v-if="contentStore.saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ contentStore.saving ? 'Saving...' : 'Save Vision' }}
            </button>
          </div>
        </div>
        <div v-if="savedSection === 'vision'" class="mt-3 flex items-center gap-2 text-emerald-600 text-sm">
          <span>✓</span> Saved successfully
        </div>
      </div>

      <!-- About -->
      <div v-else-if="activeTab === 'about'" key="about" class="card p-6 animate-fade-in">
        <div class="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
          <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-xl">🏢</div>
          <div>
            <h2 class="section-title">About Us</h2>
            <p class="text-xs text-gray-400">Your company story, background, and key information</p>
          </div>
        </div>
        <label class="label">About Content</label>
        <textarea v-model="editAbout" class="input-field min-h-60 resize-none leading-relaxed font-sans" placeholder="Tell your company story..."></textarea>
        <div class="flex items-center justify-between mt-4">
          <span class="text-xs text-gray-400">{{ editAbout.length }} characters · ~{{ Math.ceil(editAbout.split(' ').length / 200) }} min read</span>
          <div class="flex gap-2">
            <button @click="editAbout = contentStore.content.about" class="btn-outline">Reset</button>
            <button @click="save('about', editAbout)" class="btn-primary" :disabled="contentStore.saving">
              <span v-if="contentStore.saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ contentStore.saving ? 'Saving...' : 'Save About' }}
            </button>
          </div>
        </div>
        <div v-if="savedSection === 'about'" class="mt-3 flex items-center gap-2 text-emerald-600 text-sm">
          <span>✓</span> Saved successfully
        </div>
      </div>

      <!-- Services -->
      <div v-else-if="activeTab === 'services'" key="services" class="animate-fade-in space-y-4">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500">Manage the services displayed on your website</p>
        </div>
        <div v-for="(service, i) in contentStore.content.services" :key="service.id" class="card p-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center text-2xl shrink-0">{{ service.icon }}</div>
            <div class="flex-1 space-y-3">
              <div>
                <label class="label">Service Name</label>
                <input v-model="service.title" class="input-field" />
              </div>
              <div>
                <label class="label">Description</label>
                <textarea v-model="service.description" class="input-field resize-none min-h-20"></textarea>
              </div>
            </div>
          </div>
        </div>
        <button @click="saveServices" class="btn-primary" :disabled="contentStore.saving">
          <span v-if="contentStore.saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          Save Services
        </button>
        <div v-if="savedSection === 'services'" class="flex items-center gap-2 text-emerald-600 text-sm">
          <span>✓</span> Saved successfully
        </div>
      </div>
    </Transition>

    <!-- Preview panel -->
    <div class="card p-5 mt-6">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-sm font-semibold text-navy-700">Preview</span>
        <span class="badge badge-navy text-[10px]">{{ tabs.find(t => t.id === activeTab)?.label }}</span>
      </div>
      <div class="bg-gray-50 rounded-xl p-5 text-sm text-gray-600 leading-relaxed whitespace-pre-line font-sans">
        {{ previewText }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useContentStore } from '@/stores/content'

const contentStore = useContentStore()
const activeTab = ref('mission')
const savedSection = ref('')

const editMission = ref(contentStore.content.mission)
const editVision = ref(contentStore.content.vision)
const editAbout = ref(contentStore.content.about)

const tabs = [
  { id: 'mission', label: 'Mission', icon: '🎯' },
  { id: 'vision', label: 'Vision', icon: '🔭' },
  { id: 'about', label: 'About Us', icon: '🏢' },
  { id: 'services', label: 'Services', icon: '⚙️' },
]

const previewText = computed(() => {
  if (activeTab.value === 'mission') return editMission.value
  if (activeTab.value === 'vision') return editVision.value
  if (activeTab.value === 'about') return editAbout.value
  return contentStore.content.services.map(s => `${s.icon} ${s.title}\n${s.description}`).join('\n\n')
})

async function save(section, value) {
  await contentStore.saveContent(section, value)
  savedSection.value = section
  setTimeout(() => { savedSection.value = '' }, 3000)
}

async function saveServices() {
  await contentStore.saveContent('services', contentStore.content.services)
  savedSection.value = 'services'
  setTimeout(() => { savedSection.value = '' }, 3000)
}
</script>

<style scoped>
.tab-enter-active, .tab-leave-active { transition: opacity 0.15s, transform 0.15s; }
.tab-enter-from, .tab-leave-to { opacity: 0; transform: translateX(8px); }
</style>
