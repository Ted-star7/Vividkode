import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { consultationsApi } from "@/services/api/modules/consultations";

const UI_KEY = "vk_consultation_ui_v1";

function loadUiMap() {
  try {
    const raw = sessionStorage.getItem(UI_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUiMap(map) {
  try {
    sessionStorage.setItem(UI_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

function toArray(data) {
  if (Array.isArray(data)) return data;
  return [];
}

function normalizeConsultation(raw, uiById) {
  const id = String(raw?.id ?? "");
  const ui = uiById[id] || {};
  const name = raw?.fullName || "Unknown";
  const subject = raw?.service || "Consultation";
  const dateLine = [raw?.date, raw?.time].filter(Boolean).join(" · ");
  const read = Boolean(ui.read);
  const replied = Boolean(ui.replied);
  let status = "unread";
  if (replied) status = "replied";
  else if (read) status = "read";

  return {
    id: raw.id,
    name,
    email: raw?.email || "",
    subject,
    message: raw?.message || "",
    date: dateLine || raw?.date || "",
    companyName: raw?.companyName || "",
    service: raw?.service || "",
    time: raw?.time || "",
    read,
    replied,
    status,
    _raw: raw,
  };
}

export const useMessagesStore = defineStore("messages", () => {
  const messages = ref([]);
  const loading = ref(false);
  const error = ref("");

  const unreadCount = computed(
    () => messages.value.filter((m) => !m.read && !m.replied).length,
  );
  const totalMessages = computed(() => messages.value.length);

  function mergeUiState(list) {
    const uiById = loadUiMap();
    messages.value = list.map((raw) => normalizeConsultation(raw, uiById));
  }

  async function fetchConsultations() {
    loading.value = true;
    error.value = "";
    try {
      const response = await consultationsApi.list();
      const list = toArray(response?.data ?? response);
      mergeUiState(list);
      return response;
    } catch (e) {
      error.value = e?.message || "Failed to load consultations";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  function persistUi(id, patch) {
    const map = loadUiMap();
    map[String(id)] = { ...map[String(id)], ...patch };
    saveUiMap(map);
  }

  function markRead(id) {
    const msg = messages.value.find((m) => String(m.id) === String(id));
    if (!msg) return;
    msg.read = true;
    msg.replied = msg.replied || false;
    msg.status = msg.replied ? "replied" : "read";
    persistUi(id, { read: true });
  }

  function markReplied(id) {
    const msg = messages.value.find((m) => String(m.id) === String(id));
    if (!msg) return;
    msg.replied = true;
    msg.read = true;
    msg.status = "replied";
    persistUi(id, { read: true, replied: true });
  }

  async function deleteMessage(id) {
    await consultationsApi.delete(id);
    messages.value = messages.value.filter((m) => String(m.id) !== String(id));
    const map = loadUiMap();
    delete map[String(id)];
    saveUiMap(map);
  }

  return {
    messages,
    loading,
    error,
    unreadCount,
    totalMessages,
    fetchConsultations,
    markRead,
    markReplied,
    deleteMessage,
  };
});
