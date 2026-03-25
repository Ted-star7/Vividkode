import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const INITIAL_MESSAGES = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@startup.io', subject: 'Website Redesign Project', message: 'Hi, we are a growing startup looking for a complete website overhaul. We have about 20 pages and need modern design with CMS integration. Can we schedule a call to discuss?', date: '2024-04-12', read: false, replied: false, status: 'unread' },
  { id: 2, name: 'Marcus Chen', email: 'm.chen@enterprise.co', subject: 'Data Analytics Dashboard', message: 'Our team needs a custom analytics dashboard to track KPIs across our 5 departments. We currently use Salesforce and HubSpot. Looking for integration and real-time reporting.', date: '2024-04-11', read: true, replied: true, status: 'replied' },
  { id: 3, name: 'Aisha Kamau', email: 'aisha@ngo.org', subject: 'Non-profit Portal Development', message: 'We run a non-profit supporting youth education and need a donor management portal and public-facing website. Budget is limited but we are open to discussion.', date: '2024-04-10', read: true, replied: false, status: 'read' },
  { id: 4, name: 'David Osei', email: 'david.osei@retail.com', subject: 'E-commerce Migration', message: 'We want to migrate our WooCommerce store to a custom platform. We have ~500 products and need better performance and custom checkout flow.', date: '2024-04-09', read: false, replied: false, status: 'unread' },
  { id: 5, name: 'Priya Sharma', email: 'p.sharma@fintech.in', subject: 'Fintech Web Application', message: 'Reaching out about building a lending platform MVP. Need user auth, loan application flow, and admin panel. Timeline is 3 months.', date: '2024-04-08', read: true, replied: false, status: 'read' },
  { id: 6, name: 'James Omondi', email: 'james@logistics.ke', subject: 'Fleet Management System', message: "We operate a fleet of 80 vehicles across East Africa. Looking for a web-based fleet tracking and management system. Do you have experience in this area?", date: '2024-04-07', read: true, replied: true, status: 'replied' },
]

export const useMessagesStore = defineStore('messages', () => {
  const messages = ref([...INITIAL_MESSAGES])

  const unreadCount = computed(() => messages.value.filter(m => !m.read).length)
  const totalMessages = computed(() => messages.value.length)

  function markRead(id) {
    const msg = messages.value.find(m => m.id === id)
    if (msg) { msg.read = true; msg.status = msg.replied ? 'replied' : 'read' }
  }

  function markReplied(id) {
    const msg = messages.value.find(m => m.id === id)
    if (msg) { msg.replied = true; msg.read = true; msg.status = 'replied' }
  }

  function deleteMessage(id) {
    messages.value = messages.value.filter(m => m.id !== id)
  }

  return { messages, unreadCount, totalMessages, markRead, markReplied, deleteMessage }
})
