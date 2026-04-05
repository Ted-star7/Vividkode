import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { clientsApi } from "@/services/api/modules/clients";

function toArray(data) {
  if (Array.isArray(data)) return data;
  return [];
}

function parseEstPrice(s) {
  if (s == null || s === "") return 0;
  const n = Number(String(s).replace(/[^0-9.-]/g, ""));
  return Number.isNaN(n) ? 0 : n;
}

function normalizeClient(c) {
  const contact = (c?.contact ?? "").trim();
  const isEmail = contact.includes("@");
  return {
    ...c,
    id: c.id,
    name: c.client || "",
    company: "",
    email: isEmail ? contact : "",
    phone: isEmail ? "" : contact,
    service: c.service || "",
    status: (c.status || "new").toLowerCase(),
    notes: c.notes || "",
    value: parseEstPrice(c.estPrice),
    estPrice: c.estPrice,
  };
}

function toApiPayload(form) {
  const contact =
    (form.email && String(form.email).trim()) ||
    (form.phone && String(form.phone).trim()) ||
    "";
  return {
    id: form.id,
    client: form.name,
    service: form.service,
    contact,
    estPrice:
      form.value != null && form.value !== ""
        ? String(form.value)
        : String(form.estPrice ?? ""),
    status: form.status,
    notes: form.notes || "",
  };
}

export const useClientsStore = defineStore("clients", () => {
  const clients = ref([]);
  const statusCounts = ref({
    newCount: 0,
    contactedCount: 0,
    convertedCount: 0,
  });
  const loading = ref(false);
  const error = ref("");

  const totalClients = computed(() => clients.value.length);
  const activeClients = computed(
    () => statusCounts.value.convertedCount ?? clients.value.filter((c) => c.status === "converted").length,
  );
  const newLeads = computed(
    () => statusCounts.value.newCount ?? clients.value.filter((c) => c.status === "new").length,
  );

  async function fetchStatusCounts() {
    try {
      const res = await clientsApi.statusCount();
      const data = res?.data ?? res;
      if (data && typeof data === "object") {
        statusCounts.value = {
          newCount: data.newCount ?? 0,
          contactedCount: data.contactedCount ?? 0,
          convertedCount: data.convertedCount ?? 0,
        };
      }
      return res;
    } catch {
    }
  }

  async function fetchClients() {
    loading.value = true;
    error.value = "";
    try {
      const res = await clientsApi.list();
      const list = toArray(res?.data ?? res).map(normalizeClient);
      clients.value = list;
      await fetchStatusCounts();
      return res;
    } catch (e) {
      error.value = e?.message || "Failed to load clients";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function addClient(form) {
    loading.value = true;
    error.value = "";
    try {
      const payload = toApiPayload(form);
      delete payload.id;
      const res = await clientsApi.create(payload);
      await fetchClients();
      return res;
    } catch (e) {
      error.value = e?.message || "Failed to add client";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updateClient(id, form) {
    loading.value = true;
    error.value = "";
    try {
      const payload = toApiPayload({ ...form, id });
      const res = await clientsApi.update(id, payload);
      await fetchClients();
      return res;
    } catch (e) {
      error.value = e?.message || "Failed to update client";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function deleteClient(id) {
    loading.value = true;
    error.value = "";
    try {
      const res = await clientsApi.delete(id);
      await fetchClients();
      return res;
    } catch (e) {
      error.value = e?.message || "Failed to delete client";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updateStatus(id, status) {
    const client = clients.value.find((c) => String(c.id) === String(id));
    if (!client) return;
    return updateClient(id, { ...client, status });
  }

  return {
    clients,
    statusCounts,
    loading,
    error,
    totalClients,
    activeClients,
    newLeads,
    fetchClients,
    fetchStatusCounts,
    addClient,
    updateClient,
    deleteClient,
    updateStatus,
  };
});
