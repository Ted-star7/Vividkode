import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { projectsApi } from "@/services";

export const useProjectsStore = defineStore("projects", () => {
  // State
  const projects = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const totalProjects = computed(() => projects.value.length);
  
  
  const publicProjects = computed(() =>
    projects.value.filter((p) => p.status === "public")
  );
  const privateProjects = computed(() =>
    projects.value.filter((p) => p.status === "private")
  );
  
  // NEW: Filter by 'projectType' instead of the old status
  const ongoingProjects = computed(() =>
    projects.value.filter((p) => p.projectType === "ongoing")
  );
  const completedProjects = computed(() =>
    projects.value.filter((p) => p.projectType === "completed")
  );

  // Helper: Get project by ID
  function getById(id) {
    return projects.value.find((p) => p.id === Number(id) || p.id === id);
  }

  // Fetch all projects
  async function fetchProjects() {
    loading.value = true;
    error.value = null;

    try {
      const response = await projectsApi.getAll();

      if (response.success) {
        projects.value = response.data || response.projects || [];
      } else if (Array.isArray(response)) {
        projects.value = response;
      } else if (response.data && Array.isArray(response.data)) {
        projects.value = response.data;
      } else {
        projects.value = [];
      }

      return { success: true, data: projects.value };
    } catch (err) {
      error.value = err.message || "Failed to fetch projects";
      console.error("Fetch projects error:", err);
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  // Fetch single project
  async function fetchProjectById(id) {
    loading.value = true;
    error.value = null;

    try {
      const response = await projectsApi.getById(id);

      let projectData;
      if (response.success) {
        projectData = response.data || response.project;
      } else {
        projectData = response;
      }

      const index = projects.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        projects.value[index] = projectData;
      }

      return { success: true, data: projectData };
    } catch (err) {
      error.value = err.message || "Failed to fetch project";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  // Create new project
  async function createProject(projectData, images = []) {
    loading.value = true;
    error.value = null;

    try {
      const response = await projectsApi.create(projectData, images);

      let newProject;
      if (response.success) {
        newProject = response.data || response.project;
      } else {
        newProject = response;
      }

      projects.value.unshift(newProject);
      return { success: true, data: newProject };
    } catch (err) {
      error.value = err.message || "Failed to create project";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  // Update project
  async function updateProject(id, projectData, images = []) {
    loading.value = true;
    error.value = null;

    try {
      const response = await projectsApi.update(id, projectData, images);

      let updatedProject;
      if (response.success) {
        updatedProject = response.data || response.project;
      } else {
        updatedProject = response;
      }

      const index = projects.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        projects.value[index] = { ...projects.value[index], ...updatedProject };
      }

      return { success: true, data: updatedProject };
    } catch (err) {
      error.value = err.message || "Failed to update project";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  // Delete project
  async function deleteProject(id) {
    loading.value = true;
    error.value = null;

    try {
      await projectsApi.delete(id);
      projects.value = projects.value.filter((p) => p.id !== id);
      return { success: true };
    } catch (err) {
      error.value = err.message || "Failed to delete project";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  // Toggle Visibility (Public/Private)
  async function toggleVisibility(id) {
    const project = projects.value.find((p) => p.id === id);
    if (project) {
      const newStatus = project.status === "public" ? "private" : "public";
      return await updateProject(id, { status: newStatus });
    }
    return { success: false, error: "Project not found" };
  }

  // Toggle Project Type (Ongoing/Completed)
  async function toggleProjectType(id) {
    const project = projects.value.find((p) => p.id === id);
    if (project) {
      const newType = project.projectType === "ongoing" ? "completed" : "ongoing";
      return await updateProject(id, { projectType: newType });
    }
    return { success: false, error: "Project not found" };
  }

  
  return {
    projects,
    loading,
    error,
    totalProjects,
    publicProjects,
    privateProjects,
    ongoingProjects,
    completedProjects,
    getById,
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    toggleVisibility,
    toggleProjectType,
  };
});