<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h1 class="page-title">Messages</h1>
        <p class="text-sm text-gray-400 mt-0.5">
          {{ messagesStore.totalMessages }} messages · <span class="text-gold-600 font-medium">{{ messagesStore.unreadCount }} unread</span>
        </p>
      </div>
      <div class="flex gap-2">
        <button v-for="f in filters" :key="f.value"
          @click="activeFilter = f.value"
          :class="['px-4 py-2 text-xs font-semibold rounded-lg transition-all', activeFilter === f.value ? 'bg-navy-900 text-white' : 'bg-white border border-gray-200 text-navy-600 hover:bg-gray-50']">
          {{ f.label }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <!-- Message list -->
      <div class="lg:col-span-2 card overflow-hidden">
        <div class="p-3 border-b border-gray-100">
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input v-model="search" placeholder="Search messages..." class="input-field pl-9 py-2 text-sm" />
          </div>
        </div>
        <div class="divide-y divide-gray-50 overflow-y-auto max-h-[calc(100vh-280px)]">
          <div v-for="msg in filteredMessages" :key="msg.id"
            @click="selectMessage(msg)"
            :class="['flex items-start gap-3 px-4 py-4 cursor-pointer transition-colors',
              selectedMsg?.id === msg.id ? 'bg-navy-50 border-l-2 border-navy-900' : 'hover:bg-gray-50',
              !msg.read && selectedMsg?.id !== msg.id ? 'bg-gold-50/30' : ''
            ]">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              :style="{ background: getAvatarColor(msg.name) }">
              {{ msg.name.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-1">
                <span :class="['text-sm font-medium truncate', !msg.read ? 'text-navy-900 font-semibold' : 'text-navy-700']">{{ msg.name }}</span>
                <span class="text-[10px] text-gray-400 whitespace-nowrap shrink-0">{{ msg.date }}</span>
              </div>
              <p class="text-xs text-gray-500 truncate mt-0.5">{{ msg.subject }}</p>
              <p class="text-xs text-gray-400 truncate mt-0.5">{{ msg.message }}</p>
              <div class="flex items-center gap-1.5 mt-1.5">
                <span v-if="!msg.read" class="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0"></span>
                <span :class="['badge text-[9px]', getStatusBadge(msg)]">{{ msg.status }}</span>
              </div>
            </div>
          </div>
          <div v-if="filteredMessages.length === 0" class="text-center py-12 text-gray-400">
            <div class="text-3xl mb-2">📭</div>
            <p class="text-sm">No messages found</p>
          </div>
        </div>
      </div>

      <!-- Message detail -->
      <div class="lg:col-span-3">
        <Transition name="fade" mode="out-in">
          <div v-if="selectedMsg" :key="selectedMsg.id" class="card p-6 animate-fade-in">
            <!-- Header -->
            <div class="flex items-start justify-between mb-5 pb-5 border-b border-gray-100">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0"
                  :style="{ background: getAvatarColor(selectedMsg.name) }">
                  {{ selectedMsg.name.charAt(0) }}
                </div>
                <div>
                  <h3 class="font-semibold text-navy-900">{{ selectedMsg.name }}</h3>
                  <a :href="`mailto:${selectedMsg.email}`" class="text-sm text-gold-600 hover:underline">{{ selectedMsg.email }}</a>
                  <div class="text-xs text-gray-400 mt-0.5">{{ selectedMsg.date }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span :class="['badge text-[10px]', getStatusBadge(selectedMsg)]">{{ selectedMsg.status }}</span>
                <button @click="messagesStore.deleteMessage(selectedMsg.id); selectedMsg = null" class="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors text-sm">🗑</button>
              </div>
            </div>

            <!-- Subject -->
            <div class="mb-4">
              <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Subject</div>
              <h2 class="font-display text-lg font-semibold text-navy-900">{{ selectedMsg.subject }}</h2>
            </div>

            <!-- Message body -->
            <div class="bg-gray-50 rounded-xl p-5 mb-5">
              <p class="text-sm text-navy-700 leading-relaxed">{{ selectedMsg.message }}</p>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-3 flex-wrap">
              <button v-if="!selectedMsg.read" @click="messagesStore.markRead(selectedMsg.id)" class="btn-outline text-sm">
                ✉️ Mark as Read
              </button>
              <button v-if="!selectedMsg.replied" @click="openReply" class="btn-primary text-sm">
                ↩️ Reply
              </button>
              <span v-if="selectedMsg.replied" class="badge badge-green text-xs">✓ Replied</span>
              <a :href="`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject)}`"
                class="btn-ghost text-sm ml-auto">
                📧 Open in Mail
              </a>
            </div>

            <!-- Reply box -->
            <Transition name="slide-down">
              <div v-if="showReply" class="mt-5 pt-5 border-t border-gray-100">
                <label class="label">Your Reply</label>
                <textarea v-model="replyText" class="input-field min-h-28 resize-none" placeholder="Type your reply..."></textarea>
                <div class="flex gap-3 mt-3">
                  <button @click="showReply = false; replyText = ''" class="btn-outline">Cancel</button>
                  <button @click="sendReply" class="btn-primary" :disabled="!replyText.trim()">
                    Send Reply
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Empty state -->
          <div v-else class="card flex flex-col items-center justify-center py-20 text-center">
            <div class="text-5xl mb-4">📬</div>
            <h3 class="font-display text-lg font-semibold text-navy-800 mb-1">Select a message</h3>
            <p class="text-sm text-gray-400">Click a message from the list to read it here</p>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMessagesStore } from '@/stores/messages'

const messagesStore = useMessagesStore()

const search = ref('')
const activeFilter = ref('all')
const selectedMsg = ref(null)
const showReply = ref(false)
const replyText = ref('')

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Read', value: 'read' },
  { label: 'Replied', value: 'replied' },
]

const filteredMessages = computed(() => {
  return messagesStore.messages.filter(m => {
    const matchSearch = !search.value || m.name.toLowerCase().includes(search.value.toLowerCase()) || m.subject.toLowerCase().includes(search.value.toLowerCase())
    const matchFilter = activeFilter.value === 'all' || m.status === activeFilter.value
    return matchSearch && matchFilter
  })
})

function selectMessage(msg) {
  selectedMsg.value = msg
  showReply.value = false
  replyText.value = ''
  if (!msg.read) messagesStore.markRead(msg.id)
}

function getStatusBadge(msg) {
  if (msg.status === 'replied') return 'badge-green'
  if (msg.status === 'read') return 'badge-navy'
  return 'badge-gold'
}

const avatarColors = ['#102a43', '#c8861a', '#065f46', '#7c3aed', '#be185d', '#0369a1']
function getAvatarColor(name) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length]
}

function openReply() { showReply.value = true }

function sendReply() {
  messagesStore.markReplied(selectedMsg.value.id)
  showReply.value = false
  replyText.value = ''
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-down-enter-active, .slide-down-leave-active { transition: opacity 0.2s, transform 0.2s; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
