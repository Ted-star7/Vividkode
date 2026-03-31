import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useMessagesStore = defineStore("messages", () => {
  // State
  const messages = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const totalMessages = computed(() => messages.value.length);
  const unreadCount = computed(() => messages.value.filter(m => !m.read).length);

  // Fetch messages (mock for now)
  async function fetchMessages() {
    loading.value = true;
    error.value = null;

    try {
      // Mock data for now
      messages.value = [
        {
          id: 1,
          name: "Sarah Johnson",
          subject: "Website Redesign Feedback",
          date: "2 hours ago",
          read: false,
        },
        {
          id: 2,
          name: "Michael Chen",
          subject: "Project Timeline Update",
          date: "Yesterday",
          read: true,
        },
        {
          id: 3,
          name: "Emma Davis",
          subject: "New Feature Request",
          date: "2 days ago",
          read: false,
        },
        {
          id: 4,
          name: "James Wilson",
          subject: "Budget Approval",
          date: "3 days ago",
          read: true,
        },
        {
          id: 5,
          name: "Lisa Anderson",
          subject: "Meeting Rescheduled",
          date: "5 days ago",
          read: true,
        },
      ];

      return { success: true, data: messages.value };
    } catch (err) {
      error.value = err.message || "Failed to fetch messages";
      console.error("Fetch messages error:", err);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  // Mark message as read
  async function markAsRead(id) {
    const message = messages.value.find(m => m.id === id);
    if (message) {
      message.read = true;
    }
  }

  return {
    messages,
    loading,
    error,
    totalMessages,
    unreadCount,
    fetchMessages,
    markAsRead,
  };
});