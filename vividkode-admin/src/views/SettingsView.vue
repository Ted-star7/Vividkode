<template>
  <div class="p-6 max-w-3xl mx-auto">
    <div class="mb-6">
      <h1 class="page-title">Settings</h1>
      <p class="text-sm text-gray-400 mt-0.5">Manage your account and application preferences</p>
    </div>

    <div class="space-y-5">
      <!-- Profile -->
      <div class="card p-6">
        <h2 class="section-title mb-5 pb-4 border-b border-gray-100">Profile Information</h2>
        <div class="flex items-center gap-5 mb-6">
          <div class="w-16 h-16 bg-navy-900 rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-display">
            {{ auth.user?.avatar }}
          </div>
          <div>
            <div class="font-semibold text-navy-800">{{ auth.user?.name }}</div>
            <div class="text-sm text-gray-400">{{ auth.user?.email }}</div>
            <span :class="['badge text-xs mt-1', auth.user?.role === 'super_admin' ? 'badge-gold' : 'badge-navy']">
              {{ auth.user?.role === 'super_admin' ? '⭐ Super Admin' : '✏️ Editor' }}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label">Full Name</label>
            <input :value="auth.user?.name" class="input-field" readonly />
          </div>
          <div>
            <label class="label">Email Address</label>
            <input :value="auth.user?.email" class="input-field" readonly />
          </div>
          <div>
            <label class="label">Role</label>
            <input :value="auth.user?.role === 'super_admin' ? 'Super Admin' : 'Editor'" class="input-field" readonly />
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-3">Profile editing is managed by the Super Admin.</p>
      </div>

      <!-- Company -->
      <div class="card p-6">
        <h2 class="section-title mb-5 pb-4 border-b border-gray-100">Company Details</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label">Company Name</label>
            <input v-model="company.name" class="input-field" />
          </div>
          <div>
            <label class="label">Website</label>
            <input v-model="company.website" class="input-field" placeholder="https://" />
          </div>
          <div>
            <label class="label">Email</label>
            <input v-model="company.email" class="input-field" type="email" />
          </div>
          <div>
            <label class="label">Phone</label>
            <input v-model="company.phone" class="input-field" />
          </div>
          <div class="sm:col-span-2">
            <label class="label">Address</label>
            <input v-model="company.address" class="input-field" />
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button @click="saveCompany" class="btn-primary">Save Company Info</button>
        </div>
        <Transition name="fade">
          <p v-if="companySaved" class="text-sm text-emerald-600 mt-2 text-right">✓ Saved</p>
        </Transition>
      </div>

      <!-- Notifications -->
      <div class="card p-6">
        <h2 class="section-title mb-5 pb-4 border-b border-gray-100">Notification Preferences</h2>
        <div class="space-y-4">
          <label v-for="notif in notifications" :key="notif.id" class="flex items-start justify-between gap-4 cursor-pointer group">
            <div>
              <div class="text-sm font-medium text-navy-800 group-hover:text-navy-900">{{ notif.label }}</div>
              <div class="text-xs text-gray-400 mt-0.5">{{ notif.desc }}</div>
            </div>
            <div class="relative shrink-0 mt-0.5">
              <input type="checkbox" v-model="notif.enabled" class="sr-only peer" />
              <div @click="notif.enabled = !notif.enabled"
                :class="['w-10 h-5 rounded-full transition-colors cursor-pointer', notif.enabled ? 'bg-navy-900' : 'bg-gray-200']">
                <div :class="['w-4 h-4 bg-white rounded-full shadow absolute top-0.5 transition-transform', notif.enabled ? 'translate-x-5' : 'translate-x-0.5']"></div>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Security -->
      <div class="card p-6">
        <h2 class="section-title mb-5 pb-4 border-b border-gray-100">Security</h2>
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <div class="text-sm font-medium text-navy-800">Password</div>
            <div class="text-xs text-gray-400 mt-0.5">Last changed never (demo)</div>
          </div>
          <button class="btn-outline text-sm">Change Password</button>
        </div>
        <div class="mt-4 flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <div class="text-sm font-medium text-navy-800">Two-Factor Authentication</div>
            <div class="text-xs text-gray-400 mt-0.5">Add an extra layer of security</div>
          </div>
          <span class="badge badge-gray text-xs">Coming Soon</span>
        </div>
      </div>

      <!-- Danger zone -->
      <div class="card p-6 border border-red-100">
        <h2 class="section-title mb-4 text-red-600">Danger Zone</h2>
        <div class="flex items-center justify-between p-4 bg-red-50/50 rounded-xl">
          <div>
            <div class="text-sm font-medium text-navy-800">Sign out of all sessions</div>
            <div class="text-xs text-gray-400 mt-0.5">This will log you out everywhere</div>
          </div>
          <button @click="handleLogout" class="btn-danger text-sm">Sign Out</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const company = reactive({
  name: 'VividKode Creations',
  website: 'https://vividkode.com',
  email: 'hello@vividkode.com',
  phone: '+254 700 000 000',
  address: 'Nairobi, Kenya',
})

const companySaved = ref(false)

async function saveCompany() {
  await new Promise(r => setTimeout(r, 500))
  companySaved.value = true
  setTimeout(() => { companySaved.value = false }, 2500)
}

const notifications = reactive([
  { id: 1, label: 'New Messages', desc: 'Get notified when a new contact message arrives', enabled: true },
  { id: 2, label: 'New Leads', desc: 'Get notified when a new client lead is added', enabled: true },
  { id: 3, label: 'Project Updates', desc: 'Notifications when a project status changes', enabled: false },
  { id: 4, label: 'Weekly Reports', desc: 'Receive a weekly summary of dashboard activity', enabled: false },
])

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
