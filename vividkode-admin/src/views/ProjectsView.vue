<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h1 class="text-2xl font-bold text-navy-900">Projects</h1>
        <p class="text-sm text-gray-400 mt-0.5">
          {{ projectsStore.totalProjects }} projects total
        </p>
      </div>
      <button
        @click="openCreate"
        class="px-4 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800 transition-colors"
      >
        <span>＋</span> New Project
      </button>
    </div>

    <div class="flex items-center gap-3 mb-5 flex-wrap">
      <div class="relative flex-1 min-w-48">
        <span
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
          >🔍</span
        >
        <input
          v-model="search"
          placeholder="Search projects..."
          class="w-full px-4 py-2 pl-9 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900/20"
        />
      </div>
      <select
        v-model="filterProjectType"
        class="px-3 py-2 border border-gray-200 rounded-lg text-sm"
      >
        <option value="">All Types</option>
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
      </select>
      <select
        v-model="filterCategory"
        class="px-3 py-2 border border-gray-200 rounded-lg text-sm"
      >
        <option value="">All Categories</option>
        <option>Web Development</option>
        <option>Data Solutions</option>
        <option>Web Management</option>
      </select>
    </div>

    <div v-if="projectsStore.loading" class="text-center py-12">
      <div
        class="inline-block w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="text-gray-400 mt-2">Loading projects...</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
        @click="$router.push(`/projects/${project.id}`)"
      >
        <div
          :class="['h-2 rounded-t-xl', getCategoryGradient(project.category)]"
        ></div>
        <div class="p-5">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-navy-800 text-sm truncate">
                {{ project.title }}
              </h3>
              <p class="text-xs text-gray-400 mt-0.5">
                {{ project.clientName }}
              </p>
            </div>
            <span
              :class="[
                'px-2 py-1 rounded-full text-[10px] font-medium',
                project.projectType === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700',
              ]"
            >
              {{ project.projectType }}
            </span>
          </div>
          <p class="text-xs text-gray-500 line-clamp-2 mb-4">
            {{ project.projectDescription }}
          </p>
          <div class="flex flex-wrap gap-1 mb-4">
            <span
              v-for="tech in splitTechStack(project.techStack).slice(0, 3)"
              :key="tech"
              class="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
            >
              {{ tech }}
            </span>
          </div>
          <div
            class="flex items-center justify-between pt-3 border-t border-gray-100"
          >
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'w-1.5 h-1.5 rounded-full',
                  project.status === 'public' ? 'bg-green-400' : 'bg-red-400',
                ]"
              ></span>
              <span class="text-[10px] text-gray-400">{{
                project.status === "public" ? "Public" : "Private"
              }}</span>
            </div>
            <div class="flex items-center gap-1" @click.stop>
              <button
                @click="openEdit(project)"
                class="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-navy-700"
              >
                ✏️
              </button>
              <button
                @click="confirmDelete(project)"
                class="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"
              >
                🗑
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="filteredProjects.length === 0"
        class="col-span-3 text-center py-16 text-gray-400"
      >
        <div class="text-4xl mb-3">📁</div>
        <p class="font-medium">No projects found</p>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="showModal = false"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div
          class="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
        >
          <div
            class="flex items-center justify-between p-6 border-b border-gray-100"
          >
            <h2 class="text-lg font-bold text-navy-900">
              {{ isEditing ? "Edit Project" : "New Project" }}
            </h2>
            <button
              @click="showModal = false"
              class="p-2 rounded-lg hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
          <form @submit.prevent="saveProject" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Project Title *</label
              >
              <input
                v-model="form.title"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-900/20"
                required
              />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Client Name *</label
                >
                <input
                  v-model="form.clientName"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Category *</label
                >
                <select
                  v-model="form.category"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                >
                  <option>Web Development</option>
                  <option>Data Solutions</option>
                  <option>Web Management</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Description *</label
              >
              <textarea
                v-model="form.projectDescription"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg min-h-24 resize-none"
                required
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Tech Stack (comma-separated) *</label
              >
              <input
                v-model="techStackInput"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="Vue 3, Node.js, PostgreSQL"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Project Images</label
              >
              <input
                type="file"
                multiple
                accept="image/*"
                @change="handleImageUpload"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-navy-50 file:text-navy-900 hover:file:bg-navy-100"
              />
              <p
                v-if="selectedImages.length"
                class="text-xs text-gray-500 mt-2"
              >
                {{ selectedImages.length }} file(s) selected
              </p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Project Type *</label
                >
                <select
                  v-model="form.projectType"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Project Link *</label
                >
                <input
                  v-model="form.projectLink"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="https://"
                  type="url"
                  required
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                v-model="form.status"
                true-value="public"
                false-value="private"
                id="publish"
                class="w-4 h-4 rounded"
              />
              <label for="publish" class="text-sm text-gray-700"
                >Make project Public (visible on portfolio)</label
              >
            </div>
            <div class="flex gap-3 pt-2">
              <button
                type="button"
                @click="showModal = false"
                class="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800"
                :disabled="projectsStore.loading"
              >
                {{
                  projectsStore.loading
                    ? "Saving..."
                    : isEditing
                      ? "Save Changes"
                      : "Create Project"
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="deleteTarget"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="deleteTarget = null"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div
          class="relative bg-white rounded-2xl p-6 w-full max-w-sm text-center"
        >
          <div class="text-4xl mb-3">🗑️</div>
          <h3 class="text-lg font-bold text-navy-900 mb-2">Delete Project?</h3>
          <p class="text-sm text-gray-500 mb-6">
            This will permanently delete "<strong>{{
              deleteTarget?.title
            }}</strong
            >". This cannot be undone.
          </p>
          <div class="flex gap-3">
            <button
              @click="deleteTarget = null"
              class="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="doDelete"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import { useProjectsStore } from "@/stores/projects";

const projectsStore = useProjectsStore();
const search = ref("");
const filterProjectType = ref("");
const filterCategory = ref("");
const showModal = ref(false);
const isEditing = ref(false);
const deleteTarget = ref(null);
const techStackInput = ref("");
const selectedImages = ref([]);

const form = reactive({
  title: "",
  clientName: "",
  category: "Web Development",
  projectDescription: "",
  projectType: "ongoing",
  projectLink: "",
  status: "private",
});

const filteredProjects = computed(() => {
  return projectsStore.projects.filter((p) => {
    const matchSearch =
      !search.value ||
      p.title?.toLowerCase().includes(search.value.toLowerCase()) ||
      p.clientName?.toLowerCase().includes(search.value.toLowerCase());
    const matchType =
      !filterProjectType.value || p.projectType === filterProjectType.value;
    const matchCat =
      !filterCategory.value || p.category === filterCategory.value;
    return matchSearch && matchType && matchCat;
  });
});

function getCategoryGradient(cat) {
  const gradients = {
    "Web Development": "bg-gradient-to-r from-navy-700 to-navy-900",
    "Data Solutions": "bg-gradient-to-r from-yellow-600 to-yellow-700",
    "Web Management": "bg-gradient-to-r from-emerald-500 to-emerald-600",
  };
  return gradients[cat] || "bg-navy-800";
}

function splitTechStack(stackStr) {
  if (!stackStr) return [];
  return stackStr
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function handleImageUpload(event) {
  selectedImages.value = Array.from(event.target.files);
}

function openCreate() {
  isEditing.value = false;
  Object.assign(form, {
    title: "",
    clientName: "",
    category: "Web Development",
    projectDescription: "",
    projectType: "ongoing",
    projectLink: "",
    status: "private",
  });
  techStackInput.value = "";
  selectedImages.value = [];
  showModal.value = true;
}

function openEdit(project) {
  isEditing.value = true;
  Object.assign(form, { ...project });
  techStackInput.value = project.techStack || "";
  selectedImages.value = []; // Reset images so we don't accidentally re-upload old ones
  showModal.value = true;
}

async function saveProject() {
  const data = {
    ...form,
    techStack: techStackInput.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .join(", "),
  };

  if (isEditing.value) {
    await projectsStore.updateProject(form.id, data, selectedImages.value);
  } else {
    await projectsStore.createProject(data, selectedImages.value);
  }

  showModal.value = false;
}

function confirmDelete(project) {
  deleteTarget.value = project;
}

async function doDelete() {
  await projectsStore.deleteProject(deleteTarget.value.id);
  deleteTarget.value = null;
}

onMounted(() => {
  projectsStore.fetchProjects();
});

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// 2. Update your saveProject function to use it
async function saveProject() {
  const data = {
    ...form,
    techStack: techStackInput.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .join(", "),
  };

  try {
    // Convert all selected raw File objects into Base64 strings
    const base64Images = await Promise.all(
      selectedImages.value.map((file) => toBase64(file)),
    );

    if (isEditing.value) {
      await projectsStore.updateProject(form.id, data, base64Images);
    } else {
      await projectsStore.createProject(data, base64Images);
    }

    showModal.value = false;
  } catch (err) {
    console.error("Failed to save project:", err);
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
