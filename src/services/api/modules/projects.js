// services/api/modules/projects.js
import apiClient from "../client";
import { API_ENDPOINTS } from "../endpoints";
import { useAuthStore } from "@/stores/auth"; // Changed from authStore to auth (matching our refactored store name)

export const projectsApi = {
  /* =========================
     GET ALL PROJECTS
  ========================= */
  async getAll() {
    try {
      const authStore = useAuthStore();
      console.log(
        "Fetching all projects - Authenticated:",
        authStore.isAuthenticated
      );

      const response = await apiClient.get(API_ENDPOINTS.PROJECTS.LIST);
      // No need to manually add headers - client.js interceptor handles it!
      
      console.log("Projects response:", response);
      return response;
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      throw error;
    }
  },

  /* =========================
     GET PROJECT STATS
  ========================= */
  async getStats() {
    try {
      const authStore = useAuthStore();
      console.log(
        "Fetching project stats - Authenticated:",
        authStore.isAuthenticated
      );

      const response = await apiClient.get(API_ENDPOINTS.PROJECTS.STATS);
      // No need to manually add headers - client.js interceptor handles it!
      
      console.log("Stats response:", response);
      return response;
    } catch (error) {
      console.error("Failed to fetch projects stats:", error);

      // Fallback default
      return {
        success: false,
        data: {
          totalProjects: 0,
          totalPublicProjects: 0,
          totalPendingProjects: 0,
          totalCompletedProjects: 0,
          totalPrivateProjects: 0,
        },
        message: error.response?.data?.message || error.message,
      };
    }
  },

  /* =========================
     GET PROJECT BY ID
  ========================= */
  async getById(id) {
    try {
      const authStore = useAuthStore();
      const response = await apiClient.get(API_ENDPOINTS.PROJECTS.DETAIL(id));
      // No need to manually add headers - client.js interceptor handles it!
      
      return response;
    } catch (error) {
      console.error(`Failed to fetch project ${id}:`, error);
      throw error;
    }
  },

  /* =========================
     CREATE PROJECT
  ========================= */
  async create(projectData, images = []) {
    try {
      const authStore = useAuthStore();
      const formData = new FormData();

      // Append fields
      Object.entries(projectData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // Append images
      images.forEach((image, index) => {
        if (typeof image === "string" && image.startsWith("data:image")) {
          formData.append("images", base64ToBlob(image), `image_${index}.jpg`);
        } else if (image instanceof File) {
          formData.append("images", image);
        }
      });

      const response = await apiClient.post(
        API_ENDPOINTS.PROJECTS.CREATE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // No need to add Authorization header - client.js interceptor handles it!
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Failed to create project:", error);
      throw error;
    }
  },

  /* =========================
     UPDATE PROJECT
  ========================= */
  async update(id, projectData, images = []) {
    try {
      const authStore = useAuthStore();
      const formData = new FormData();

      Object.entries(projectData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      images.forEach((image, index) => {
        if (typeof image === "string" && image.startsWith("data:image")) {
          formData.append("images", base64ToBlob(image), `image_${index}.jpg`);
        } else if (image instanceof File) {
          formData.append("images", image);
        }
      });

      const response = await apiClient.put(
        API_ENDPOINTS.PROJECTS.UPDATE(id),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // No need to add Authorization header - client.js interceptor handles it!
          },
        }
      );

      return response;
    } catch (error) {
      console.error(`Failed to update project ${id}:`, error);
      throw error;
    }
  },

  /* =========================
     DELETE PROJECT
  ========================= */
  async delete(id) {
    try {
      const authStore = useAuthStore();
      const response = await apiClient.delete(API_ENDPOINTS.PROJECTS.DELETE(id));
      // No need to manually add headers - client.js interceptor handles it!
      
      return response;
    } catch (error) {
      console.error(`Failed to delete project ${id}:`, error);
      throw error;
    }
  },
};

/* =========================
   HELPER: BASE64 TO BLOB
========================= */
function base64ToBlob(base64) {
  const [header, data] = base64.split(";base64,");
  const contentType = header.split(":")[1];
  const raw = atob(data);
  const uInt8Array = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
}