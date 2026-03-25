<template>
  <div class="p-6 space-y-6 max-w-7xl mx-auto">
    <!-- Welcome banner -->
    <div class="bg-navy-950 rounded-2xl p-6 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10"
        style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>
      <div class="absolute top-0 right-0 w-64 h-full opacity-20">
        <div class="w-full h-full bg-gradient-to-l from-gold-500 to-transparent"></div>
      </div>
      <div class="relative z-10 flex items-center justify-between flex-wrap gap-4">
        <div>
          <p class="text-gold-400 text-xs font-semibold uppercase tracking-widest mb-1">Welcome back</p>
          <h1 class="font-display text-2xl font-bold text-white">{{ auth.user?.name }} 👋</h1>
          <p class="text-navy-300 text-sm mt-1">Here's what's happening at VividKode today.</p>
        </div>
        <div class="text-right">
          <div class="text-white font-display text-lg font-semibold">{{ currentDate }}</div>
          <div class="text-navy-400 text-xs mt-0.5">{{ currentTime }}</div>
        </div>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(stat, i) in stats" :key="stat.label"
        :class="['stat-card animate-fade-in', `stagger-${i+1}`]">
        <div class="flex items-start justify-between mb-4">
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-xl', stat.iconBg]">
            {{ stat.icon }}
          </div>
          <span :class="['text-xs font-semibold px-2 py-0.5 rounded-full', stat.changeBg]">
            {{ stat.change }}
          </span>
        </div>
        <div class="font-display text-3xl font-bold text-navy-900">{{ stat.value }}</div>
        <div class="text-sm text-gray-500 mt-1">{{ stat.label }}</div>
        <!-- Mini bar -->
        <div class="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div :class="['h-full rounded-full transition-all duration-1000', stat.barColor]" :style="{ width: stat.barWidth }"></div>
        </div>
      </div>
    </div>

    <!-- Charts row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Revenue chart -->
      <div class="card p-5 lg:col-span-2 animate-fade-in stagger-2">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h3 class="section-title">Project Activity</h3>
            <p class="text-xs text-gray-400 mt-0.5">Projects completed & started per month</p>
          </div>
          <select class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-900/10">
            <option>2024</option>
          </select>
        </div>
        <Bar :data="barData" :options="barOptions" class="max-h-56" />
      </div>

      <!-- Status pie -->
      <div class="card p-5 animate-fade-in stagger-3">
        <div class="mb-5">
          <h3 class="section-title">Project Status</h3>
          <p class="text-xs text-gray-400 mt-0.5">Current portfolio breakdown</p>
        </div>
        <Doughnut :data="doughnutData" :options="doughnutOptions" class="max-h-44" />
        <div class="mt-4 space-y-2">
          <div v-for="item in statusLegend" :key="item.label" class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-2.5 h-2.5 rounded-full" :style="{ background: item.color }"></div>
              <span class="text-xs text-gray-600">{{ item.label }}</span>
            </div>
            <span class="text-xs font-semibold text-navy-800">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Recent projects -->
      <div class="card animate-fade-in stagger-3">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 class="section-title">Recent Projects</h3>
          <RouterLink to="/projects" class="text-xs text-gold-600 hover:text-gold-700 font-semibold">View all →</RouterLink>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="project in recentProjects" :key="project.id" class="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
            <div class="w-8 h-8 bg-navy-50 rounded-lg flex items-center justify-center text-sm shrink-0">
              {{ getCategoryIcon(project.category) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-navy-800 truncate">{{ project.title }}</div>
              <div class="text-xs text-gray-400">{{ project.client }}</div>
            </div>
            <span :class="['badge text-[10px]', project.status === 'completed' ? 'badge-green' : 'badge-gold']">
              {{ project.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Recent messages -->
      <div class="card animate-fade-in stagger-4">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 class="section-title">Recent Messages</h3>
          <RouterLink to="/messages" class="text-xs text-gold-600 hover:text-gold-700 font-semibold">View all →</RouterLink>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="msg in recentMessages" :key="msg.id"
            class="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors cursor-pointer"
            @click="$router.push('/messages')">
            <div class="w-8 h-8 bg-navy-900 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
              {{ msg.name.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-navy-800">{{ msg.name }}</span>
                <span v-if="!msg.read" class="w-1.5 h-1.5 bg-gold-500 rounded-full shrink-0"></span>
              </div>
              <div class="text-xs text-gray-400 truncate">{{ msg.subject }}</div>
            </div>
            <span class="text-[10px] text-gray-400 whitespace-nowrap">{{ msg.date }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity feed -->
    <div class="card p-5 animate-fade-in stagger-5">
      <h3 class="section-title mb-4">Recent Activity</h3>
      <div class="relative">
        <div class="absolute left-4 top-0 bottom-0 w-px bg-gray-100"></div>
        <div class="space-y-4">
          <div v-for="activity in activities" :key="activity.id" class="flex items-start gap-4 pl-10 relative">
            <div class="absolute left-2 top-1 w-5 h-5 rounded-full flex items-center justify-center text-xs z-10"
              :class="activity.bg">{{ activity.icon }}</div>
            <div>
              <p class="text-sm text-navy-700">{{ activity.text }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import { useMessagesStore } from '@/stores/messages'
import { useClientsStore } from '@/stores/clients'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const auth = useAuthStore()
const projectsStore = useProjectsStore()
const messagesStore = useMessagesStore()
const clientsStore = useClientsStore()

const currentDate = computed(() => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))
const currentTime = ref(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))

setInterval(() => { currentTime.value = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }, 1000)

const stats = computed(() => [
  { label: 'Total Projects', value: projectsStore.totalProjects, icon: '📁', iconBg: 'bg-navy-50', change: '+2 this month', changeBg: 'bg-navy-50 text-navy-600', barColor: 'bg-navy-700', barWidth: '72%' },
  { label: 'Messages', value: messagesStore.totalMessages, icon: '📩', iconBg: 'bg-gold-50', change: `${messagesStore.unreadCount} unread`, changeBg: 'bg-gold-50 text-gold-700', barColor: 'bg-gold-500', barWidth: '58%' },
  { label: 'Active Clients', value: clientsStore.activeClients, icon: '👥', iconBg: 'bg-emerald-50', change: '+1 converted', changeBg: 'bg-emerald-50 text-emerald-700', barColor: 'bg-emerald-500', barWidth: '45%' },
  { label: 'New Leads', value: clientsStore.newLeads, icon: '✨', iconBg: 'bg-purple-50', change: 'This week', changeBg: 'bg-purple-50 text-purple-600', barColor: 'bg-purple-500', barWidth: '30%' },
])

const recentProjects = computed(() => projectsStore.projects.slice(0, 5))
const recentMessages = computed(() => messagesStore.messages.slice(0, 5))

function getCategoryIcon(category) {
  const icons = { 'Web Development': '💻', 'Data Solutions': '📊', 'Web Management': '⚙️' }
  return icons[category] || '📁'
}

const barData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    { label: 'Completed', data: [1, 0, 2, 1, 3, 1, 2, 0, 1, 2, 1, 0], backgroundColor: '#102a43', borderRadius: 6, borderSkipped: false },
    { label: 'Started', data: [2, 1, 1, 2, 1, 2, 1, 3, 1, 0, 2, 1], backgroundColor: '#c8861a', borderRadius: 6, borderSkipped: false },
  ]
}

const barOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: true, position: 'top', labels: { boxWidth: 8, usePointStyle: true, font: { size: 11 }, padding: 16 } }, tooltip: { backgroundColor: '#0a1929', padding: 10, cornerRadius: 8 } },
  scales: { x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11 }, color: '#9fb3c8' } }, y: { grid: { color: '#f3f4f6' }, border: { display: false }, ticks: { font: { size: 11 }, color: '#9fb3c8', stepSize: 1 } } }
}

const doughnutData = {
  labels: ['Completed', 'Ongoing'],
  datasets: [{ data: [projectsStore.projects.filter(p => p.status === 'completed').length, projectsStore.ongoingProjects.length], backgroundColor: ['#102a43', '#c8861a'], borderWidth: 0, hoverBorderWidth: 2, hoverBorderColor: '#fff' }]
}

const doughnutOptions = {
  responsive: true, maintainAspectRatio: false, cutout: '70%',
  plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0a1929', padding: 10, cornerRadius: 8 } }
}

const statusLegend = computed(() => [
  { label: 'Completed', color: '#102a43', value: projectsStore.projects.filter(p => p.status === 'completed').length },
  { label: 'Ongoing', color: '#c8861a', value: projectsStore.ongoingProjects.length },
])

const activities = [
  { id: 1, icon: '✅', bg: 'bg-emerald-100 text-emerald-700', text: 'Project "LogiChain Supply Management" marked as completed', time: '2 hours ago' },
  { id: 2, icon: '📩', bg: 'bg-gold-100 text-gold-700', text: 'New message received from Sarah Johnson — Website Redesign', time: '4 hours ago' },
  { id: 3, icon: '👤', bg: 'bg-navy-100 text-navy-700', text: 'New lead added: Priya Sharma from FinTech IN', time: '6 hours ago' },
  { id: 4, icon: '🚀', bg: 'bg-purple-100 text-purple-700', text: 'Project "HealthTrack Patient Portal" created and added to pipeline', time: 'Yesterday' },
  { id: 5, icon: '✏️', bg: 'bg-blue-100 text-blue-700', text: 'Company "About Us" content section updated', time: '2 days ago' },
]
</script>
