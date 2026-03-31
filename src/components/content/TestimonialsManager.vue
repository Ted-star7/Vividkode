<template>
  <div class="space-y-4">
    <div class="card p-5">
      <h3 class="section-title mb-4">{{ isEditing ? "Edit Testimonial" : "Add Testimonial" }}</h3>
      <div class="grid grid-cols-1 gap-3">
        <div>
          <label class="label">Name</label>
          <input v-model="form.name" class="input-field" placeholder="Client name" />
        </div>
        <div>
          <label class="label">Message</label>
          <textarea v-model="form.message" class="input-field min-h-24 resize-none" placeholder="Client feedback"></textarea>
        </div>
        <div>
          <label class="label">Rating (1 - 5)</label>
          <input v-model.number="form.rate" type="number" min="1" max="5" class="input-field" />
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button class="btn-outline" @click="resetForm">Reset</button>
        <button class="btn-primary" :disabled="store.saving" @click="submit">
          {{ store.saving ? "Saving..." : isEditing ? "Update Testimonial" : "Create Testimonial" }}
        </button>
      </div>
    </div>

    <div class="card p-5">
      <h3 class="section-title mb-3">Testimonials</h3>
      <p v-if="!store.testimonials.length" class="text-sm text-gray-500">No testimonials added yet.</p>
      <div v-else class="space-y-2">
        <div v-for="item in store.testimonials" :key="item.id" class="border border-gray-100 rounded-lg p-3 flex items-start justify-between gap-4">
          <div>
            <p class="font-semibold text-navy-800">{{ item.name }}</p>
            <p class="text-sm text-gray-600 mt-1">{{ item.message }}</p>
            <p class="text-xs text-gold-600 mt-1">Rating: {{ item.rate }}/5</p>
          </div>
          <div class="flex gap-2">
            <button class="btn-outline" @click="loadForEdit(item)">Edit</button>
            <button class="btn-danger" @click="remove(item.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useContentStore } from "@/stores/content";

const store = useContentStore();
const isEditing = ref(false);
const editingId = ref("");
const form = reactive({
  name: "",
  message: "",
  rate: 5,
});

function resetForm() {
  isEditing.value = false;
  editingId.value = "";
  form.name = "";
  form.message = "";
  form.rate = 5;
}

function loadForEdit(item) {
  isEditing.value = true;
  editingId.value = String(item.id);
  form.name = item.name || "";
  form.message = item.message || "";
  form.rate = Number(item.rate || 5);
}

async function submit() {
  const payload = {
    id: editingId.value || undefined,
    name: String(form.name || "").trim(),
    message: String(form.message || "").trim(),
    rate: Number(form.rate || 5),
  };

  if (!payload.name || !payload.message) return;
  if (payload.rate < 1 || payload.rate > 5) return;

  if (isEditing.value && editingId.value) {
    await store.updateTestimonial(editingId.value, payload);
  } else {
    await store.createTestimonial(payload);
  }
  resetForm();
}

async function remove(id) {
  await store.deleteTestimonial(id);
}
</script>
