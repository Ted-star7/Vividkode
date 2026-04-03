<template>
  <div class="p-6 space-y-6 max-w-7xl mx-auto">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="text-center">
        <div
          class="inline-block w-12 h-12 border-4 border-navy-900 border-t-transparent rounded-full animate-spin"
        ></div>
        <p class="text-gray-400 mt-4">Loading dashboard...</p>
      </div>
    </div>

    <div v-else>
      <!-- Welcome banner -->
      <div class="bg-navy-950 rounded-2xl p-6 relative overflow-hidden">
        <div
          class="absolute inset-0 opacity-10"
          style="
            background-image: radial-gradient(
              circle at 2px 2px,
              white 1px,
              transparent 0
            );
            background-size: 24px 24px;
          "
        ></div>
        <div class="absolute top-0 right-0 w-64 h-full opacity-20">
          <div
            class="w-full h-full bg-gradient-to-l from-gold-500 to-transparent"
          ></div>
        </div>
        <div
          class="relative z-10 flex items-center justify-between flex-wrap gap-4"
        >
          <div>
            <p
              class="text-gold-400 text-xs font-semibold uppercase tracking-widest mb-1"
            >
              Welcome back
            </p>
            <h1 class="font-display text-2xl font-bold text-white">
              {{ getUserDisplayName() }} 👋
            </h1>
            <p class="text-navy-300 text-sm mt-1">
              Here's what's happening at VividKode today.
            </p>
          </div>
          <div class="text-right">
            <div class="text-white font-display text-lg font-semibold">
              {{ currentDate }}
            </div>
            <div class="text-navy-400 text-xs mt-0.5">{{ currentTime }}</div>
          </div>
        </div>
      </div>

      <!-- Stat cards - Using real data from projectsStore.stats with safe fallbacks -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          v-for="(stat, i) in statsCards"
          :key="stat.label"
          class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          @click="router.push(stat.route)"
        >
          <div class="flex items-start justify-between mb-4">
            <div
              :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center text-xl',
                stat.iconBg,
              ]"
            >
              {{ stat.icon }}
            </div>
            <span
              :class="[
                'text-xs font-semibold px-2 py-0.5 rounded-full',
                stat.changeBg,
              ]"
            >
              {{ stat.change }}
            </span>
          </div>
          <div class="text-3xl font-bold text-navy-900">
            {{ stat.value }}
          </div>
          <div class="text-sm text-gray-500 mt-1">{{ stat.label }}</div>
          <div class="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              :class="[
                'h-full rounded-full transition-all duration-1000',
                stat.barColor,
              ]"
              :style="{ width: stat.barWidth }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Charts row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Project Activity Chart -->
        <div
          class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 lg:col-span-2"
        >
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="font-semibold text-navy-900">Project Activity</h3>
              <p class="text-xs text-gray-400 mt-0.5">
                Projects completed & started per month
              </p>
            </div>
            <select
              v-model.number="selectedYear"
              class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-900/10"
            >
              <option :value="2024">2024</option>
              <option :value="2025">2025</option>
              <option :value="2026">2026</option>
            </select>
          </div>
          <Bar :data="barData" :options="barOptions" class="max-h-56" />
        </div>

        <!-- Status pie -->
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div class="mb-5">
            <h3 class="font-semibold text-navy-900">Project Status</h3>
            <p class="text-xs text-gray-400 mt-0.5">
              Current portfolio breakdown
            </p>
          </div>
          <Doughnut
            :data="doughnutData"
            :options="doughnutOptions"
            class="max-h-44"
          />
          <div class="mt-4 space-y-2">
            <div
              v-for="item in statusLegend"
              :key="item.label"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <div
                  class="w-2.5 h-2.5 rounded-full"
                  :style="{ background: item.color }"
                ></div>
                <span class="text-xs text-gray-600">{{ item.label }}</span>
              </div>
              <span class="text-xs font-semibold text-navy-800">{{
                item.value
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Recent projects -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div
            class="flex items-center justify-between px-5 py-4 border-b border-gray-100"
          >
            <h3 class="font-semibold text-navy-900">Recent Projects</h3>
            <RouterLink
              to="/dashboard/projects"
              class="text-xs text-gold-600 hover:text-gold-700 font-semibold"
              >View all →</RouterLink
            >
          </div>
          <div class="divide-y divide-gray-50">
            <div
              v-for="project in recentProjects"
              :key="project.id"
              class="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors cursor-pointer"
              @click="$router.push(`/dashboard/projects/${project.id}`)"
            >
              <div
                class="w-8 h-8 bg-navy-50 rounded-lg flex items-center justify-center text-sm shrink-0"
              >
                {{ getCategoryIcon(project.category) }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-navy-800 truncate">
                  {{ project.title }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ project.clientName }}
                </div>
              </div>
              <span
                :class="[
                  'px-2 py-1 rounded-full text-[10px] font-medium',
                  project.projectType === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700',
                ]"
              >
                {{ project.projectType }}
              </span>
            </div>
            <div
              v-if="recentProjects.length === 0"
              class="text-center py-8 text-gray-400"
            >
              No projects yet. Create your first project!
            </div>
          </div>
        </div>

        <!-- Recent messages -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div
            class="flex items-center justify-between px-5 py-4 border-b border-gray-100"
          >
            <h3 class="font-semibold text-navy-900">Recent Messages</h3>
            <RouterLink
              to="/dashboard/messages"
              class="text-xs text-gold-600 hover:text-gold-700 font-semibold"
              >View all →</RouterLink
            >
          </div>
          <div class="divide-y divide-gray-50">
            <div
              v-for="msg in recentMessages"
              :key="msg.id"
              class="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors cursor-pointer"
              @click="$router.push('/dashboard/messages')"
            >
              <div
                class="w-8 h-8 bg-navy-900 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              >
                {{ msg.name?.charAt(0) || "?" }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-navy-800">{{
                    msg.name || "Unknown"
                  }}</span>
                  <span
                    v-if="!msg.read"
                    class="w-1.5 h-1.5 bg-gold-500 rounded-full shrink-0"
                  ></span>
                </div>
                <div class="text-xs text-gray-400 truncate">
                  {{ msg.subject || "No subject" }}
                </div>
              </div>
              <span class="text-[10px] text-gray-400 whitespace-nowrap">{{
                msg.date || "Just now"
              }}</span>
            </div>
            <div
              v-if="recentMessages.length === 0"
              class="text-center py-8 text-gray-400"
            >
              No messages yet.
            </div>
          </div>
        </div>
      </div>

      <!-- Activity feed -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 class="font-semibold text-navy-900 mb-4">Recent Activity</h3>
        <div class="relative">
          <div class="absolute left-4 top-0 bottom-0 w-px bg-gray-100"></div>
          <div class="space-y-4">
            <div
              v-for="activity in activities"
              :key="activity.id"
              class="flex items-start gap-4 pl-10 relative"
            >
              <div
                class="absolute left-2 top-1 w-5 h-5 rounded-full flex items-center justify-center text-xs z-10"
                :class="activity.bg"
              >
                {{ activity.icon }}
              </div>
              <div>
                <p class="text-sm text-navy-700">{{ activity.text }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { Bar, Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";
import { useAuthStore } from "@/stores/auth";
import { useProjectsStore } from "@/stores/projects";
import { useMessagesStore } from "@/stores/messages";

// Register ChartJS components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
);

const auth = useAuthStore();
const projectsStore = useProjectsStore();
const messagesStore = useMessagesStore();
const router = useRouter();

// Loading state
const loading = ref(true);
const selectedYear = ref(2026);

// Get user display name
function getUserDisplayName() {
  if (auth.user?.name) return auth.user.name;
  if (auth.user?.email) return auth.user.email.split("@")[0];
  return "Admin";
}

// Safe stats access with fallbacks
const safeStats = computed(() => ({
  totalProjects: projectsStore.stats?.totalProjects ?? 0,
  totalPublicProjects: projectsStore.stats?.totalPublicProjects ?? 0,
  totalPrivateProjects: projectsStore.stats?.totalPrivateProjects ?? 0,
  totalPendingProjects: projectsStore.stats?.totalPendingProjects ?? 0,
  totalCompletedProjects: projectsStore.stats?.totalCompletedProjects ?? 0,
}));

// Stats cards using safe data
const statsCards = computed(() => [
  {
    label: "Total Projects",
    value: safeStats.value.totalProjects,
    icon: "📁",
    iconBg: "bg-navy-50",
    change: `${safeStats.value.totalProjects} total`,
    changeBg: "bg-navy-50 text-navy-600",
    barColor: "bg-navy-700",
    barWidth: `${Math.min((safeStats.value.totalProjects / 20) * 100, 100)}%`,
    route: "/dashboard/projects",
  },
  {
    label: "Public Projects",
    value: safeStats.value.totalPublicProjects,
    icon: "🌍",
    iconBg: "bg-green-50",
    change: "Visible on portfolio",
    changeBg: "bg-green-50 text-green-700",
    barColor: "bg-green-500",
    barWidth: `${Math.min((safeStats.value.totalPublicProjects / 20) * 100, 100)}%`,
    route: "/dashboard/projects",
  },
  {
    label: "Private Projects",
    value: safeStats.value.totalPrivateProjects,
    icon: "🔒",
    iconBg: "bg-gray-50",
    change: "Internal only",
    changeBg: "bg-gray-50 text-gray-600",
    barColor: "bg-gray-500",
    barWidth: `${Math.min((safeStats.value.totalPrivateProjects / 20) * 100, 100)}%`,
    route: "/dashboard/projects",
  },
  {
    label: "Pending Projects",
    value: safeStats.value.totalPendingProjects,
    icon: "⏳",
    iconBg: "bg-yellow-50",
    change: "In progress",
    changeBg: "bg-yellow-50 text-yellow-700",
    barColor: "bg-yellow-500",
    barWidth: `${Math.min((safeStats.value.totalPendingProjects / 20) * 100, 100)}%`,
    route: "/dashboard/projects",
  },
  {
    label: "Completed Projects",
    value: safeStats.value.totalCompletedProjects,
    icon: "✅",
    iconBg: "bg-emerald-50",
    change: "Done",
    changeBg: "bg-emerald-50 text-emerald-700",
    barColor: "bg-emerald-500",
    barWidth: `${Math.min((safeStats.value.totalCompletedProjects / 20) * 100, 100)}%`,
    route: "/dashboard/projects",
  },
]);

// Bar chart data - using real project data
const barData = computed(() => {
  const monthlyData = projectsStore.getMonthlyActivityData(
    Number(selectedYear.value),
  );
  return {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Completed",
        data: monthlyData.completed,
        backgroundColor: "#102a43",
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: "Started",
        data: monthlyData.started,
        backgroundColor: "#c8861a",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };
});

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top",
      labels: {
        boxWidth: 8,
        usePointStyle: true,
        font: { size: 11 },
        padding: 16,
      },
    },
    tooltip: { backgroundColor: "#0a1929", padding: 10, cornerRadius: 8 },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { font: { size: 11 }, color: "#9fb3c8" },
    },
    y: {
      grid: { color: "#f3f4f6" },
      border: { display: false },
      ticks: { font: { size: 11 }, color: "#9fb3c8", stepSize: 1 },
    },
  },
};

// Chart data using safe stats
const doughnutData = computed(() => ({
  labels: ["Completed", "Pending"],
  datasets: [
    {
      data: [
        safeStats.value.totalCompletedProjects,
        safeStats.value.totalPendingProjects,
      ],
      backgroundColor: ["#102a43", "#c8861a"],
      borderWidth: 0,
      hoverBorderWidth: 2,
      hoverBorderColor: "#fff",
    },
  ],
}));

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%",
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor: "#0a1929", padding: 10, cornerRadius: 8 },
  },
};

const statusLegend = computed(() => [
  {
    label: "Completed",
    color: "#102a43",
    value: safeStats.value.totalCompletedProjects,
  },
  {
    label: "Pending",
    color: "#c8861a",
    value: safeStats.value.totalPendingProjects,
  },
]);

// Recent projects (first 5 from store)
const recentProjects = computed(() =>
  (projectsStore.projects || []).slice(0, 5),
);

// Recent messages (first 5 from store)
const recentMessages = computed(() =>
  (messagesStore.messages || []).slice(0, 5),
);

function getCategoryIcon(category) {
  const icons = {
    "Web Development": "💻",
    "Data Solutions": "📊",
    "Web Management": "⚙️",
  };
  return icons[category] || "📁";
}

const currentDate = computed(() =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }),
);
const currentTime = ref(
  new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }),
);

setInterval(() => {
  currentTime.value = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}, 1000);

const activities = [
  {
    id: 1,
    icon: "✅",
    bg: "bg-emerald-100 text-emerald-700",
    text: 'Project "LogiChain Supply Management" marked as completed',
    time: "2 hours ago",
  },
];

// Load data on mount
onMounted(async () => {
  loading.value = true;
  try {
    const promises = [
      projectsStore.fetchStats(),
      projectsStore.fetchProjects(),
      messagesStore.fetchConsultations(),
    ];

    const results = await Promise.allSettled(promises);

    // Log
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`API call ${index} failed:`, result.reason);
      }
    });
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>

</style>
