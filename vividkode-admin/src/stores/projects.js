import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const INITIAL_PROJECTS = [
  {
    id: 1, title: 'TechNova E-Commerce Platform', description: 'Full-stack e-commerce solution with real-time inventory management and advanced analytics dashboard for a mid-sized retail company.',
    techStack: ['Vue 3', 'Node.js', 'PostgreSQL', 'Redis'], status: 'completed', published: true,
    client: 'TechNova Ltd', link: 'https://technova.com', image: '', createdAt: '2024-01-15', updatedAt: '2024-03-20',
    category: 'Web Development'
  },
  {
    id: 2, title: 'DataFlow Analytics Suite', description: 'Enterprise data visualization platform with custom reporting, ETL pipelines, and interactive dashboards for business intelligence.',
    techStack: ['React', 'Python', 'Apache Spark', 'Tableau'], status: 'ongoing', published: true,
    client: 'DataFlow Inc', link: '', image: '', createdAt: '2024-02-10', updatedAt: '2024-04-01',
    category: 'Data Solutions'
  },
  {
    id: 3, title: 'HealthTrack Patient Portal', description: 'HIPAA-compliant patient management system with appointment scheduling, telemedicine integration, and secure messaging.',
    techStack: ['Next.js', 'Django', 'PostgreSQL', 'WebRTC'], status: 'ongoing', published: false,
    client: 'HealthFirst Clinic', link: '', image: '', createdAt: '2024-03-01', updatedAt: '2024-04-10',
    category: 'Web Development'
  },
  {
    id: 4, title: 'LogiChain Supply Management', description: 'Real-time supply chain visibility platform with predictive analytics, vendor management, and automated reporting.',
    techStack: ['Vue 3', 'FastAPI', 'MongoDB', 'Kafka'], status: 'completed', published: true,
    client: 'LogiChain Corp', link: 'https://logichain.io', image: '', createdAt: '2023-11-05', updatedAt: '2024-01-30',
    category: 'Data Solutions'
  },
  {
    id: 5, title: 'CreativeHub Portfolio CMS', description: 'Custom content management system for creative agencies with drag-and-drop builder and multi-site management.',
    techStack: ['Nuxt 3', 'Strapi', 'MySQL', 'Cloudinary'], status: 'completed', published: true,
    client: 'Creative Studio X', link: 'https://creativehubx.com', image: '', createdAt: '2023-09-12', updatedAt: '2023-12-15',
    category: 'Web Management'
  },
]

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([...INITIAL_PROJECTS])
  const loading = ref(false)

  const totalProjects = computed(() => projects.value.length)
  const publishedProjects = computed(() => projects.value.filter(p => p.published))
  const ongoingProjects = computed(() => projects.value.filter(p => p.status === 'ongoing'))

  function getById(id) {
    return projects.value.find(p => p.id === Number(id))
  }

  async function createProject(data) {
    loading.value = true
    await new Promise(r => setTimeout(r, 500))
    const newProject = { ...data, id: Date.now(), createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0] }
    projects.value.unshift(newProject)
    loading.value = false
    return newProject
  }

  async function updateProject(id, data) {
    loading.value = true
    await new Promise(r => setTimeout(r, 400))
    const idx = projects.value.findIndex(p => p.id === Number(id))
    if (idx !== -1) {
      projects.value[idx] = { ...projects.value[idx], ...data, updatedAt: new Date().toISOString().split('T')[0] }
    }
    loading.value = false
  }

  async function deleteProject(id) {
    await new Promise(r => setTimeout(r, 300))
    projects.value = projects.value.filter(p => p.id !== Number(id))
  }

  async function togglePublish(id) {
    const project = projects.value.find(p => p.id === Number(id))
    if (project) project.published = !project.published
  }

  return { projects, loading, totalProjects, publishedProjects, ongoingProjects, getById, createProject, updateProject, deleteProject, togglePublish }
})
