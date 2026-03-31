import { defineStore } from 'pinia'
import { ref } from 'vue'
import { contentApi } from '@/services/api/modules/content'

function toArray(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.items)) return data.items
  if (Array.isArray(data?.rows)) return data.rows
  return []
}

export const useContentStore = defineStore('content', () => {
  const content = ref({
    mission: 'To empower businesses through innovative digital solutions — crafting exceptional web experiences, robust data architectures, and intelligent systems that drive measurable growth and lasting competitive advantage.',
    vision: 'To be the most trusted technology partner for forward-thinking companies across Africa and beyond, renowned for our technical excellence, creative problem-solving, and unwavering commitment to client success.',
    about: `VividKode Creations is a full-service digital agency founded on the belief that great technology should be both powerful and beautiful. We specialize in three core disciplines: bespoke web development, ongoing website management and optimization, and advanced data solutions.

Our team of engineers, designers, and data scientists collaborate closely with each client to understand their unique challenges and opportunities. We don't deliver cookie-cutter solutions — every project is crafted from scratch with your specific goals in mind.

Founded in Nairobi, Kenya, we serve clients across East Africa, Europe, and North America. Our diverse team brings global perspectives to local challenges, ensuring solutions that are technically sound, culturally aware, and commercially viable.

Whether you're a startup building your first digital presence or an enterprise modernizing your data infrastructure, VividKode has the expertise, passion, and track record to deliver results that matter.`,
    services: [
      { id: 1, title: 'Website Development', icon: '💻', description: 'Custom web applications built with modern frameworks, optimized for performance, security, and scalability.' },
      { id: 2, title: 'Web Management', icon: '⚙️', description: 'Ongoing maintenance, updates, SEO optimization, and performance monitoring to keep your digital presence at its best.' },
      { id: 3, title: 'Data Solutions', icon: '📊', description: 'From data pipelines to interactive dashboards — we help you collect, process, and visualize data for smarter decisions.' },
    ]
  })

  const saving = ref(false)
  const loading = ref(false)
  const error = ref('')
  const visionMissionId = ref('')
  const testimonials = ref([])

  async function saveContent(section, value) {
    saving.value = true
    error.value = ''
    try {
      if (section === 'mission' || section === 'vision') {
        const payload = {
          mission: section === 'mission' ? value : content.value.mission,
          vission: section === 'vision' ? value : content.value.vision,
        }
        let response
        if (visionMissionId.value) {
          response = await contentApi.updateVisionMission(visionMissionId.value, payload)
        } else {
          response = await contentApi.createVisionMission(payload)
        }
        const data = response?.data || response
        if (data?.id) visionMissionId.value = String(data.id)
        content.value.mission = data?.mission ?? payload.mission
        content.value.vision = data?.vission ?? payload.vission
        return response
      }

      // About/services are not covered by the provided backend endpoints yet.
      content.value[section] = value
      return { success: true, data: content.value[section] }
    } catch (e) {
      error.value = e?.message || 'Failed to save content'
      throw e
    } finally {
      saving.value = false
    }
  }

  async function fetchVisionMission(id) {
    if (!id) return null
    loading.value = true
    error.value = ''
    try {
      const response = await contentApi.getVisionMission(id)
      const data = response?.data || response
      visionMissionId.value = String(data?.id || id)
      content.value.mission = data?.mission ?? content.value.mission
      content.value.vision = data?.vission ?? content.value.vision
      return response
    } catch (e) {
      error.value = e?.message || 'Failed to fetch vision and mission'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchVisionMissionList() {
    loading.value = true
    error.value = ''
    try {
      const response = await contentApi.listVisionMission()
      const list = toArray(response?.data ?? response)
      if (list.length > 0) {
        const first = list[0]
        visionMissionId.value = String(first?.id || '')
        content.value.mission = first?.mission ?? content.value.mission
        content.value.vision = first?.vission ?? content.value.vision
      }
      return list
    } catch (e) {
      error.value = e?.message || 'Failed to fetch vision and mission list'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createTestimonial(payload) {
    saving.value = true
    error.value = ''
    try {
      const response = await contentApi.createTestimonial(payload)
      const data = response?.data || response
      testimonials.value.unshift(data)
      return response
    } catch (e) {
      error.value = e?.message || 'Failed to create testimonial'
      throw e
    } finally {
      saving.value = false
    }
  }

  async function fetchTestimonials() {
    loading.value = true
    error.value = ''
    try {
      const response = await contentApi.listTestimonials()
      testimonials.value = toArray(response?.data ?? response)
      return testimonials.value
    } catch (e) {
      error.value = e?.message || 'Failed to fetch testimonials'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function getTestimonial(id) {
    loading.value = true
    error.value = ''
    try {
      const response = await contentApi.getTestimonial(id)
      const data = response?.data || response
      const idx = testimonials.value.findIndex((t) => String(t?.id) === String(id))
      if (idx >= 0) testimonials.value[idx] = data
      else testimonials.value.unshift(data)
      return data
    } catch (e) {
      error.value = e?.message || 'Failed to fetch testimonial'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateTestimonial(id, payload) {
    saving.value = true
    error.value = ''
    try {
      const response = await contentApi.updateTestimonial(id, payload)
      const data = response?.data || response
      const idx = testimonials.value.findIndex((t) => String(t?.id) === String(id))
      if (idx >= 0) testimonials.value[idx] = data
      return response
    } catch (e) {
      error.value = e?.message || 'Failed to update testimonial'
      throw e
    } finally {
      saving.value = false
    }
  }

  async function deleteTestimonial(id) {
    saving.value = true
    error.value = ''
    try {
      const response = await contentApi.deleteTestimonial(id)
      testimonials.value = testimonials.value.filter((t) => String(t?.id) !== String(id))
      return response
    } catch (e) {
      error.value = e?.message || 'Failed to delete testimonial'
      throw e
    } finally {
      saving.value = false
    }
  }

  return {
    content,
    testimonials,
    saving,
    loading,
    error,
    visionMissionId,
    saveContent,
    fetchVisionMission,
    fetchVisionMissionList,
    fetchTestimonials,
    createTestimonial,
    getTestimonial,
    updateTestimonial,
    deleteTestimonial,
  }
})
