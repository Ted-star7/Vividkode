<template>
  <div class="min-h-screen bg-navy-950 flex items-center justify-center relative overflow-hidden">
    <!-- Background texture -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 32px 32px;"></div>
    </div>
    <!-- Gold accent blobs -->
    <div class="absolute top-1/4 -left-32 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-1/4 -right-32 w-96 h-96 bg-navy-700/40 rounded-full blur-3xl"></div>

    <div class="relative z-10 w-full max-w-md px-6 animate-fade-in">
      <!-- Logo area -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-gold">
            <VKLogo :width="32" :height="32" color="#102a43" />
          </div>
          <div class="text-left">
            <div class="font-display text-xl font-bold text-white leading-none">VividKode</div>
            <div class="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mt-0.5">Creations</div>
          </div>
        </div>
        <h1 class="font-display text-3xl font-bold text-white mb-2">Welcome back</h1>
        <p class="text-navy-300 text-sm">Sign in to your admin dashboard</p>
      </div>

      <!-- Login card -->
      <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Error -->
          <Transition name="fade">
            <div v-if="error" class="flex items-center gap-2 bg-red-500/15 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3">
              <span class="text-base">⚠️</span>
              {{ error }}
            </div>
          </Transition>

          <div>
            <label class="block text-xs font-semibold text-navy-300 uppercase tracking-wider mb-1.5">Email address</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="admin@vividkode.com"
              required
              class="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder-navy-400 text-sm
                focus:outline-none focus:ring-2 focus:ring-gold-400/40 focus:border-gold-400/60 transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-navy-300 uppercase tracking-wider mb-1.5">Password</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                class="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder-navy-400 text-sm
                  focus:outline-none focus:ring-2 focus:ring-gold-400/40 focus:border-gold-400/60 transition-all pr-12"
              />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-white transition-colors text-sm">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-white font-semibold rounded-lg
              transition-all duration-150 text-sm shadow-gold flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
          </button>
        </form>

        <!-- Demo credentials -->
        <div class="mt-6 pt-5 border-t border-white/10">
          <p class="text-navy-400 text-xs text-center mb-3">Demo credentials</p>
          <div class="grid grid-cols-2 gap-2">
            <button @click="fillDemo('admin')" class="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-navy-300 rounded-lg px-3 py-2 transition-all text-left">
              <div class="font-medium text-white">Super Admin</div>
              <div>admin@vividkode.com</div>
            </button>
            <button @click="fillDemo('editor')" class="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-navy-300 rounded-lg px-3 py-2 transition-all text-left">
              <div class="font-medium text-white">Editor</div>
              <div>editor@vividkode.com</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import VKLogo from '@/components/VKLogo.vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

function fillDemo(type) {
  if (type === 'admin') { form.email = 'admin@vividkode.com'; form.password = 'admin123' }
  else { form.email = 'editor@vividkode.com'; form.password = 'editor123' }
}

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await auth.login(form.email, form.password)
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
