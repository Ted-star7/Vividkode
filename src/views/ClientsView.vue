<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h1 class="page-title">Clients & Leads</h1>
        <p class="text-sm text-gray-400 mt-0.5">{{ clientsStore.totalClients }} total · {{ clientsStore.activeClients }} converted</p>
        <p v-if="clientsStore.error" class="text-xs text-red-500 mt-1">{{ clientsStore.error }}</p>
      </div>
      <button @click="openCreate" class="btn-primary">＋ Add Client</button>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="card p-4 flex items-center gap-3">
        <div class="w-10 h-10 bg-gold-50 rounded-xl flex items-center justify-center text-xl">✨</div>
        <div>
          <div class="font-display text-2xl font-bold text-navy-900">{{ clientsStore.newLeads }}</div>
          <div class="text-xs text-gray-400">New Leads</div>
        </div>
      </div>
      <div class="card p-4 flex items-center gap-3">
        <div class="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center text-xl">📞</div>
        <div>
          <div class="font-display text-2xl font-bold text-navy-900">{{ clientsStore.statusCounts.contacted || 0 }}</div>
          <div class="text-xs text-gray-400">Contacted</div>
        </div>
      </div>
      <div class="card p-4 flex items-center gap-3">
        <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-xl">✅</div>
        <div>
          <div class="font-display text-2xl font-bold text-navy-900">{{ clientsStore.activeClients }}</div>
          <div class="text-xs text-gray-400">Converted</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-3 mb-4 flex-wrap">
      <div class="relative flex-1 min-w-48">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input v-model="search" placeholder="Search clients..." class="input-field pl-9" />
      </div>
      <div class="flex gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
        <button v-for="s in statusFilters" :key="s.value"
          @click="activeStatus = s.value"
          :class="['px-3 py-1.5 text-xs font-semibold rounded-md transition-all', activeStatus === s.value ? 'bg-navy-900 text-white' : 'text-gray-500 hover:text-navy-700']">
          {{ s.label }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div v-if="clientsStore.loading" class="card p-12 text-center text-gray-400 text-sm">Loading clients…</div>
    <div v-else class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[800px]">
          <thead>
            <tr>
              <th class="table-header">Client</th>
              <th class="table-header hidden md:table-cell">Service</th>
              <th class="table-header hidden lg:table-cell">Contact</th>
              <th class="table-header hidden lg:table-cell">Est. Value</th>
              <th class="table-header">Status</th>
              <th class="table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in filteredClients" :key="client.id" class="table-row">
              <td class="table-cell">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    :style="{ background: getColor(client.name) }">
                    {{ (client.name || '?').charAt(0) }}
                  </div>
                  <div>
                    <div class="font-medium text-navy-800 text-sm">{{ client.name }}</div>
                    <div class="text-xs text-gray-400">{{ client.company || '-' }}</div>
                  </div>
                </div>
              </td>
              <td class="table-cell md:table-cell text-xs text-gray-600">{{ client.service || '-' }}</td>
              <td class="hidden lg:table-cell">
                <div class="text-xs text-gray-600">{{ client.email || '-' }}</div>
                <div class="text-xs text-gray-400">{{ client.phone || '-' }}</div>
              </td>
              <td class="table-cell lg:table-cell">
                <span class="font-mono text-sm font-semibold text-navy-800">{{
                  client.estPrice != null && client.estPrice !== ''
                    ? client.estPrice
                    : client.value != null && client.value !== 0
                      ? client.value.toLocaleString()
                      : '—'
                }}</span>
              </td>
              <td class="table-cell">
                <select
                  :value="client.status"
                  @change="updateClientStatus(client, $event.target.value)"
                  :class="['text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy-900/20', getStatusClass(client.status)]">
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                </select>
              </td>
              <td class="table-cell">
                <div class="flex items-center gap-1">
                  <button @click="openEdit(client)" class="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-navy-700 transition-colors text-sm" title="Edit">✏️</button>
                  <button @click="viewNotes(client)" class="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors text-sm" title="Notes">📋</button>
                  <button @click="deleteTarget = client" class="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors text-sm" title="Delete">🗑</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="filteredClients.length === 0" class="text-center py-12 text-gray-400">
        <div class="text-4xl mb-2">👥</div>
        <p>No clients found</p>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showModal = false">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <div class="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 class="font-display text-lg font-bold text-navy-900">{{ isEditing ? 'Edit Client' : 'Add Client' }}</h2>
              <button @click="showModal = false" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">✕</button>
            </div>
            <form @submit.prevent="saveClient" class="p-6 space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="label">Full Name *</label>
                  <input v-model="form.name" class="input-field" required />
                </div>
                <div>
                  <label class="label">Company</label>
                  <input v-model="form.company" class="input-field" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="label">Email</label>
                  <input v-model="form.email" class="input-field" type="email" />
                  <p class="text-xs text-gray-400 mt-1">Either email or phone required</p>
                </div>
                <div>
                  <label class="label">Phone</label>
                  <input v-model="form.phone" class="input-field" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="label">Service</label>
                  <select v-model="form.service" class="input-field">
                    <option value="Web Development">Web Development</option>
                    <option value="Web Management">Web Management</option>
                    <option value="Data Solutions">Data Solutions</option>
                  </select>
                </div>
                <div>
                  <label class="label">Status</label>
                  <select v-model="form.status" class="input-field">
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="label">Estimated Value</label>
                <input v-model="form.estPrice" class="input-field" placeholder="e.g., 50,000" />
              </div>
              <div>
                <label class="label">Notes</label>
                <textarea v-model="form.notes" class="input-field resize-none min-h-20" placeholder="Any relevant notes..."></textarea>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" @click="showModal = false" class="btn-outline flex-1">Cancel</button>
                <button type="submit" class="btn-primary flex-1">{{ isEditing ? 'Save Changes' : 'Add Client' }}</button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Notes modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="notesClient" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="notesClient = null">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div class="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
            <div class="flex items-center justify-between mb-4">
              <h2 class="font-display text-lg font-bold text-navy-900">Notes — {{ notesClient.name }}</h2>
              <button @click="notesClient = null" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">✕</button>
            </div>
            <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-sm text-navy-700 leading-relaxed whitespace-pre-wrap">{{ notesClient.notes || 'No notes yet.' }}</p>
            </div>
            <button @click="notesClient = null" class="btn-outline w-full mt-4">Close</button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete confirm -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="deleteTarget = null">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div class="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-scale-in text-center">
            <div class="text-4xl mb-3">🗑️</div>
            <h3 class="font-display text-lg font-bold text-navy-900 mb-2">Remove Client?</h3>
            <p class="text-sm text-gray-500 mb-6">Remove <strong>{{ deleteTarget.name }}</strong> from your records?</p>
            <div class="flex gap-3">
              <button @click="deleteTarget = null" class="btn-outline flex-1">Cancel</button>
              <button @click="doDelete" class="btn-danger flex-1">Remove</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useClientsStore } from '@/stores/clients'

const clientsStore = useClientsStore()
const search = ref('')
const activeStatus = ref('all')
const showModal = ref(false)
const isEditing = ref(false)
const deleteTarget = ref(null)
const notesClient = ref(null)

const form = reactive({ 
  name: '', 
  company: '', 
  email: '', 
  phone: '', 
  service: 'Web Development', 
  status: 'new', 
  estPrice: '', 
  notes: '' 
})

const statusFilters = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Converted', value: 'converted' },
]

const filteredClients = computed(() => {
  if (!clientsStore.clients) return []
  return clientsStore.clients.filter(c => {
    const matchSearch = !search.value || 
      c.name?.toLowerCase().includes(search.value.toLowerCase()) || 
      c.company?.toLowerCase().includes(search.value.toLowerCase())
    const matchStatus = activeStatus.value === 'all' || c.status === activeStatus.value
    return matchSearch && matchStatus
  })
})

function getStatusClass(status) {
  const classes = { 
    new: 'bg-gold-50 text-gold-700', 
    contacted: 'bg-navy-50 text-navy-700', 
    converted: 'bg-emerald-50 text-emerald-700' 
  }
  return classes[status] || 'bg-gray-100 text-gray-600'
}

const colors = ['#102a43', '#c8861a', '#065f46', '#7c3aed', '#be185d', '#0369a1', '#9a3412']
function getColor(name) { 
  if (!name) return colors[0]
  return colors[name.charCodeAt(0) % colors.length] 
}

function openCreate() {
  isEditing.value = false
  Object.assign(form, { 
    name: '', 
    company: '', 
    email: '', 
    phone: '', 
    service: 'Web Development', 
    status: 'new', 
    estPrice: '', 
    notes: '' 
  })
  showModal.value = true
}

function openEdit(client) {
  isEditing.value = true
  Object.assign(form, { 
    id: client.id,
    name: client.name || '', 
    company: client.company || '', 
    email: client.email || '', 
    phone: client.phone || '', 
    service: client.service || 'Web Development', 
    status: client.status || 'new', 
    estPrice: client.estPrice || '', 
    notes: client.notes || '' 
  })
  showModal.value = true
}

function viewNotes(client) { 
  notesClient.value = client 
}

async function saveClient() {
  try {
    // Validate that either email or phone is provided
    if (!form.email && !form.phone) {
      alert('Please provide either email or phone number')
      return
    }
    
    if (isEditing.value) {
      await clientsStore.updateClient(form.id, { ...form })
    } else {
      await clientsStore.addClient({ ...form })
    }
    showModal.value = false
  } catch (error) {
    console.error('Failed to save client:', error)
    alert('Failed to save client. Please try again.')
  }
}

async function updateClientStatus(client, newStatus) {
  try {
    await clientsStore.updateStatus(client.id, newStatus)
  } catch (error) {
    console.error('Failed to update status:', error)
    alert('Failed to update status. Please try again.')
  }
}

async function doDelete() {
  try {
    await clientsStore.deleteClient(deleteTarget.value.id)
    deleteTarget.value = null
  } catch (error) {
    console.error('Failed to delete client:', error)
    alert('Failed to delete client. Please try again.')
  }
}

onMounted(() => {
  clientsStore.fetchClients().catch((error) => {
    console.error('Failed to fetch clients:', error)
  })
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0a1929;
  font-family: 'Playfair Display', serif;
}

.btn-primary {
  background-color: #c8861a;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary:hover {
  background-color: #b07816;
  transform: translateY(-1px);
}

.btn-outline {
  border: 1px solid #e5e7eb;
  background-color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-outline:hover {
  background-color: #f9fafb;
}

.btn-danger {
  background-color: #dc2626;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-danger:hover {
  background-color: #b91c1c;
}

.card {
  background-color: white;
  border-radius: 1rem;
  border: 1px solid #f3f4f6;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #c8861a;
  /* ring: 2px solid rgba(200, 134, 26, 0.2); */
}

.label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.table-header {
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  background-color: #f9fafb;
  border-bottom: 1px solid #f3f4f6;
}

.table-cell {
  padding: 1rem;
  font-size: 0.875rem;
  border-bottom: 1px solid #f9fafb;
}

.table-row:hover {
  background-color: #f9fafb;
}
</style>