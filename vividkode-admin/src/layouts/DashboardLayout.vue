<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 flex flex-col bg-navy-950 transition-all duration-300 ease-in-out',
        sidebarOpen ? 'w-64' : 'w-0 lg:w-16',
        'lg:relative lg:flex',
        isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0',
      ]"
    >
      <!-- Logo (hide when collapsed on mobile) -->
      <div class="flex items-center h-16 px-4 border-b border-white/8 shrink-0">
        <div class="flex items-center gap-3 overflow-hidden">
          <div
            class="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center shrink-0"
          >
            <VKLogo :width="22" :height="22" color="white" />
          </div>
          <Transition name="slide-fade">
            <div v-if="sidebarOpen" class="whitespace-nowrap">
              <div
                class="font-display text-sm font-bold text-white leading-none"
              >
                VividKode
              </div>
              <div
                class="text-gold-400 text-[9px] font-semibold tracking-[0.18em] uppercase mt-0.5"
              >
                Creations
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        <div v-if="sidebarOpen" class="px-2 mb-2">
          <span
            class="text-[10px] font-semibold text-navy-500 uppercase tracking-widest"
            >Main</span
          >
        </div>
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          custom
          v-slot="{ isActive, navigate }"
        >
          <div
            @click="handleNavClick(navigate)"
            :class="[
              'flex items-center gap-3 px-2 py-2.5 rounded-lg cursor-pointer transition-all duration-150 group',
              isActive
                ? 'bg-gold-500 text-white'
                : 'text-navy-400 hover:text-white hover:bg-white/8',
            ]"
            :title="!sidebarOpen ? item.label : ''"
          >
            <span
              class="text-lg w-5 flex items-center justify-center shrink-0"
              >{{ item.icon }}</span
            >
            <Transition name="slide-fade">
              <span
                v-if="sidebarOpen"
                class="text-sm font-medium whitespace-nowrap flex-1"
                >{{ item.label }}</span
              >
            </Transition>
            <Transition name="slide-fade">
              <span
                v-if="sidebarOpen && item.badge"
                class="ml-auto bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              >
                {{ item.badge }}
              </span>
            </Transition>
          </div>
        </RouterLink>
      </nav>

      <!-- User / Toggle -->
      <div class="border-t border-white/8 p-3 space-y-2 shrink-0">
        <button
          @click="toggleSidebar"
          class="flex items-center gap-3 px-2 py-2 rounded-lg text-navy-400 hover:text-white hover:bg-white/8 transition-all w-full"
        >
          <span class="text-lg w-5 flex items-center justify-center shrink-0">{{
            sidebarOpen ? "◀" : "▶"
          }}</span>
          <Transition name="slide-fade">
            <span
              v-if="sidebarOpen"
              class="text-xs font-medium whitespace-nowrap"
              >Collapse sidebar</span
            >
          </Transition>
        </button>
        <div class="flex items-center gap-3 px-2 py-2">
          <div
            class="w-7 h-7 bg-gold-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
          >
            {{ auth.user?.avatar || getUserInitials() }}
          </div>
          <Transition name="slide-fade">
            <div v-if="sidebarOpen" class="overflow-hidden flex-1">
              <div class="text-white text-xs font-semibold truncate">
                {{ auth.user?.name }}
              </div>
              <div class="text-navy-400 text-[10px] truncate">
                {{
                  auth.user?.role?.toLowerCase() === "super_admin"
                    ? "Super Admin"
                    : "Editor"
                }}
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div
      class="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300"
      :class="{
        'lg:ml-0': true,
        'ml-0': !sidebarOpen || isMobile,
      }"
    >
      <!-- Topbar -->
      <header
        class="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 shadow-sm"
      >
        <div class="flex items-center gap-4">
          <!-- Hamburger button for mobile -->
          <button
            class="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            @click="toggleSidebar"
          >
            <span class="text-navy-600 text-xl">☰</span>
          </button>
          <div>
            <h2 class="font-display text-base font-semibold text-navy-900">
              {{ currentPageTitle }}
            </h2>
            <div class="flex items-center gap-1 text-[11px] text-gray-400">
              <span>Admin</span>
              <span>›</span>
              <span class="text-navy-600">{{ currentPageTitle }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <!-- Notification bell -->
          <div class="relative">
            <button
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-navy-500"
              @click="notifOpen = !notifOpen"
            >
              <span>🔔</span>
            </button>
            <span
              v-if="messagesStore.unreadCount > 0"
              class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
            >
              {{ messagesStore.unreadCount }}
            </span>
          </div>

          <!-- User menu -->
          <div class="relative">
            <button
              @click="userMenuOpen = !userMenuOpen"
              class="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-gray-100 transition-all"
            >
              <div class="text-right hidden sm:block">
                <div class="text-xs font-semibold text-navy-800">
                  {{ auth.user?.name }}
                </div>
                <div class="text-[10px] text-gray-400">
                  {{
                    auth.user?.role?.toLowerCase() === "super_admin"
                      ? "Super Admin"
                      : "Editor"
                  }}
                </div>
              </div>
              <div
                class="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              >
                {{ auth.user?.avatar || getUserInitials() }}
              </div>
            </button>
            <Transition name="dropdown">
              <div
                v-if="userMenuOpen"
                class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-card-hover border border-gray-100 py-1.5 z-50"
              >
                <RouterLink
                  to="/dashboard/settings"
                  @click="closeUserMenu"
                  class="flex items-center gap-2.5 px-4 py-2 text-sm text-navy-700 hover:bg-gray-50 transition-colors"
                >
                  <span>⚙️</span> Settings
                </RouterLink>
                <div class="border-t border-gray-100 my-1"></div>
                <button
                  @click="handleLogout"
                  class="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <span>🚪</span> Sign Out
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="$route.path" />
          </Transition>
        </RouterView>
      </main>
    </div>

    <!-- Mobile overlay -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen && isMobile"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
        @click="closeSidebar"
      ></div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter, RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useMessagesStore } from "@/stores/messages";
import VKLogo from "@/components/VKLogo.vue";

const auth = useAuthStore();
const messagesStore = useMessagesStore();
const router = useRouter();
const route = useRoute();

const sidebarOpen = ref(true);
const userMenuOpen = ref(false);
const notifOpen = ref(false);
const isMobile = ref(false);

// Watch for route changes to close mobile sidebar
watch(
  () => route.path,
  () => {
    if (isMobile.value) {
      closeSidebar();
    }
  },
);

const navItems = computed(() => [
  { name: "dashboard", path: "/dashboard", icon: "📊", label: "Dashboard" },
  {
    name: "projects",
    path: "/dashboard/projects",
    icon: "📁",
    label: "Projects",
  },
  {
    name: "messages",
    path: "/dashboard/messages",
    icon: "📩",
    label: "Messages",
    badge: messagesStore.unreadCount || null,
  },
  { name: "clients", path: "/dashboard/clients", icon: "👥", label: "Clients" },
  { name: "content", path: "/dashboard/content", icon: "🧭", label: "Content" },
  {
    name: "settings",
    path: "/dashboard/settings",
    icon: "⚙️",
    label: "Settings",
  },
]);

const routeTitles = {
  dashboard: "Dashboard",
  projects: "Projects",
  "project-detail": "Project Detail",
  messages: "Messages",
  clients: "Clients",
  content: "Content Manager",
  settings: "Settings",
};

const currentPageTitle = computed(() => routeTitles[route.name] || "Dashboard");

// Helper function to get user initials
function getUserInitials() {
  if (!auth.user?.name) return "U";
  return auth.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Toggle sidebar with mobile awareness
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
  // On desktop, remember the state
  if (!isMobile.value) {
    localStorage.setItem("sidebarOpen", sidebarOpen.value);
  }
}

// Close sidebar (for mobile)
function closeSidebar() {
  if (isMobile.value) {
    sidebarOpen.value = false;
  }
}

// Handle navigation click - close sidebar on mobile
function handleNavClick(navigate) {
  navigate();
  if (isMobile.value) {
    closeSidebar();
  }
}

function closeUserMenu() {
  userMenuOpen.value = false;
}

function handleLogout() {
  auth.logout();
  router.push("/login");
}

function checkMobile() {
  const wasMobile = isMobile.value;
  isMobile.value = window.innerWidth < 1024;

  // Handle sidebar state when switching between mobile and desktop
  if (wasMobile !== isMobile.value) {
    if (isMobile.value) {
      // Switching to mobile - close sidebar by default
      sidebarOpen.value = false;
    } else {
      // Switching to desktop - restore saved state or default to open
      const savedState = localStorage.getItem("sidebarOpen");
      sidebarOpen.value = savedState !== null ? savedState === "true" : true;
    }
  }
}

onMounted(() => {
  // Restore sidebar state from localStorage on desktop
  if (!isMobile.value) {
    const savedState = localStorage.getItem("sidebarOpen");
    if (savedState !== null) {
      sidebarOpen.value = savedState === "true";
    }
  }

  checkMobile();
  window.addEventListener("resize", checkMobile);

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".relative")) {
      userMenuOpen.value = false;
      notifOpen.value = false;
    }
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

<style scoped>
.slide-fade-enter-active {
  transition:
    opacity 0.15s,
    transform 0.15s;
}
.slide-fade-leave-active {
  transition: opacity 0.1s;
  position: absolute;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-6px);
}
.slide-fade-leave-to {
  opacity: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.15s,
    transform 0.15s;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Mobile sidebar transition */
@media (max-width: 1023px) {
  aside {
    transition: transform 0.3s ease-in-out;
  }
}
</style>
