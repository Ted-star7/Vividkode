import { defineStore } from "pinia";
import { ref, computed } from "vue";

const INITIAL_MESSAGES = [
  {
    id: 1,
    name: "James Mwangi",
    email: "jmwangi@jsmart.co.ke",
    subject: "Website Redesign for Jsmart",
    message:
      "Hello, we are planning a full redesign of the Jsmart website. The site will have around 20 pages including services, blog, and contact sections. We would like a modern UI and CMS integration. Can we schedule a call to discuss?",
    date: "2024-04-12",
    read: false,
    replied: false,
    status: "unread",
  },
  {
    id: 2,
    name: "Grace Wanjiku",
    email: "gwanjiku@hopebridge.org",
    subject: "NGO Data Analytics Dashboard",
    message:
      "Greetings. At HopeBridge NGO we would like to build a dashboard to track donor contributions, volunteer activity, and program impact reports. We are looking for data visualization and reporting features.",
    date: "2024-04-11",
    read: true,
    replied: true,
    status: "replied",
  },
  {
    id: 3,
    name: "David Otieno",
    email: "dotieno@jsmart.co.ke",
    subject: "eBook Design and Publishing Support",
    message:
      "Hi, I am preparing an entrepreneurship and leadership eBook and would like help with formatting, design, and publishing. Ideally the final version should be ready for Kindle and PDF distribution.",
    date: "2024-04-10",
    read: true,
    replied: false,
    status: "read",
  },
];

export const useMessagesStore = defineStore("messages", () => {
  const messages = ref([...INITIAL_MESSAGES]);

  const unreadCount = computed(
    () => messages.value.filter((m) => !m.read).length,
  );
  const totalMessages = computed(() => messages.value.length);

  function markRead(id) {
    const msg = messages.value.find((m) => m.id === id);
    if (msg) {
      msg.read = true;
      msg.status = msg.replied ? "replied" : "read";
    }
  }

  function markReplied(id) {
    const msg = messages.value.find((m) => m.id === id);
    if (msg) {
      msg.replied = true;
      msg.read = true;
      msg.status = "replied";
    }
  }

  function deleteMessage(id) {
    messages.value = messages.value.filter((m) => m.id !== id);
  }

  return {
    messages,
    unreadCount,
    totalMessages,
    markRead,
    markReplied,
    deleteMessage,
  };
});
