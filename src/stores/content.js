import { defineStore } from 'pinia'
import { ref } from 'vue'

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

  async function saveContent(section, value) {
    saving.value = true
    await new Promise(r => setTimeout(r, 600))
    content.value[section] = value
    saving.value = false
  }

  return { content, saving, saveContent }
})
