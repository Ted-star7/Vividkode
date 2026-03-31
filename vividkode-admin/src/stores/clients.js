import { defineStore } from "pinia";
import { ref, computed } from "vue";

const INITIAL_CLIENTS = [
  {
    id: 1,
    name: "James Mwangi",
    company: "Jsmart Solutions",
    email: "jmwangi@jsmart.co.ke",
    phone: "+254 712 456 789",
    service: "Web Development",
    status: "new",
    notes:
      "Wants complete redesign, about 20 pages including donation and volunteer sections",
    value: 45000,
    createdAt: "2024-04-12",
  },

  {
    id: 2,
    name: "Grace Wanjiku",
    company: "HopeBridge NGO",
    email: "gwanjiku@hopebridge.org",
    phone: "+254 722 389 114",
    service: "Web Development",
    status: "converted",
    notes:
      "Needs analytics dashboard for donor tracking and program impact reports",
    value: 30000,
    createdAt: "2024-03-15",
  },
  {
    id: 3,
    name: "David Otieno",
    company: "Jsmart Solutions",
    email: "dotieno@jsmart.co.ke",
    phone: "+254 734 558 219",
    service: "eBook Development",
    status: "new",
    notes:
      "Needs design, formatting, and publishing support for a leadership and entrepreneurship eBook",
    value: 85000, // KSh
    currency: "KSh",
    createdAt: "2024-05-02",
  },
  // { id: 3, name: 'Aisha Kamau', company: 'Youth Education NGO', email: 'aisha@ngo.org', phone: '+254 722 345 678', service: 'Web Development', status: 'contacted', notes: 'Non-profit, donor management portal', value: 2800, createdAt: '2024-04-10' },
  // { id: 4, name: 'David Osei', company: 'Retail Group', email: 'david.osei@retail.com', phone: '+233 20 456 7890', service: 'Web Management', status: 'contacted', notes: 'WooCommerce migration, ~500 products', value: 7200, createdAt: '2024-04-09' },
  // { id: 5, name: 'Priya Sharma', company: 'Fintech IN', email: 'p.sharma@fintech.in', phone: '+91 98765 43210', service: 'Web Development', status: 'new', notes: 'Lending platform MVP, 3 months timeline', value: 18000, createdAt: '2024-04-08' },
  // { id: 6, name: 'James Omondi', company: 'Logistics KE', email: 'james@logistics.ke', phone: '+254 733 456 789', service: 'Data Solutions', status: 'converted', notes: 'Fleet management, 80 vehicles', value: 9500, createdAt: '2024-03-01' },
  // { id: 7, name: 'Elena Vasquez', company: 'MedTech Solutions', email: 'elena@medtech.com', phone: '+34 612 345 678', service: 'Data Solutions', status: 'contacted', notes: 'Healthcare analytics platform', value: 22000, createdAt: '2024-02-20' },
];

export const useClientsStore = defineStore("clients", () => {
  const clients = ref([...INITIAL_CLIENTS]);

  const totalClients = computed(() => clients.value.length);
  const activeClients = computed(
    () => clients.value.filter((c) => c.status === "converted").length,
  );
  const newLeads = computed(
    () => clients.value.filter((c) => c.status === "new").length,
  );

  async function addClient(data) {
    await new Promise((r) => setTimeout(r, 400));
    clients.value.unshift({
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
    });
  }

  async function updateClient(id, data) {
    const idx = clients.value.findIndex((c) => c.id === id);
    if (idx !== -1) clients.value[idx] = { ...clients.value[idx], ...data };
  }

  async function deleteClient(id) {
    clients.value = clients.value.filter((c) => c.id !== id);
  }

  function updateStatus(id, status) {
    const client = clients.value.find((c) => c.id === id);
    if (client) client.status = status;
  }

  return {
    clients,
    totalClients,
    activeClients,
    newLeads,
    addClient,
    updateClient,
    deleteClient,
    updateStatus,
  };
});
