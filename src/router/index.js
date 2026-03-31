import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/auth";

// Lazy-loaded route components
const LoginView = () => import('@/views/LoginView.vue')
const DashboardLayout = () => import('@/layouts/DashboardLayout.vue')
const DashboardView = () => import('@/views/DashboardView.vue')
const ProjectsView = () => import('@/views/ProjectsView.vue')
const ProjectDetailView = () => import('@/views/ProjectDetailView.vue')
const MessagesView = () => import('@/views/MessagesView.vue')
const ClientsView = () => import('@/views/ClientsView.vue')
const ContentView = () => import('@/views/ContentView.vue')
const SettingsView = () => import('@/views/SettingsView.vue')
const forgotPasswordView = () => import('@/views/ForgotPasswordView.vue')

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { public: true } 
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/ForgotPasswordView.vue'),
    meta: { public: true } 
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true }, 
    children: [
      { path: '', name: 'dashboard', component: DashboardView },
      { path: 'projects', name: 'projects', component: ProjectsView },
      { path: 'projects/:id', name: 'project-detail', component: ProjectDetailView },
      { path: 'messages', name: 'messages', component: MessagesView },
      { path: 'clients', name: 'clients', component: ClientsView },
      { path: 'content', name: 'content', component: ContentView },
      { path: 'settings', name: 'settings', component: SettingsView },
    ]
  },
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  
  // Check if the route requires authentication
  // This checks both parent and child routes
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isPublic = to.matched.some(record => record.meta.public)
  
  // console.log('Route:', to.path)
  // console.log('Requires Auth:', requiresAuth)
  // console.log('Is Authenticated:', auth.isAuthenticated)
  
  // If route requires auth and user is not authenticated
  if (requiresAuth && !auth.isAuthenticated) {
    next({ 
      name: 'login', 
      query: { redirect: to.fullPath } 
    })
  } 
  // If user is authenticated and trying to access login page
  else if (to.name === 'login' && auth.isAuthenticated) {
    next({ name: 'dashboard' })
  } 
  else {
    next()
  }
})

export default router