import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';

export const projectsApi = {
  async getAll() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PROJECTS.LIST);
      return response;
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw error;
    }
  },
  
  async getById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PROJECTS.DETAIL(id));
      return response;
    } catch (error) {
      console.error(`Failed to fetch project ${id}:`, error);
      throw error;
    }
  },
  
  async create(projectData, images = []) {
    try {
      const formData = new FormData();
      
      // Log what we're sending
      console.log('Creating project with data:', projectData);
      console.log('Images count:', images.length);
      
      // Append all fields - IMPORTANT: Match exact field names expected by backend
      if (projectData.title) formData.append('title', projectData.title);
      if (projectData.clientName) formData.append('clientName', projectData.clientName);
      if (projectData.category) formData.append('category', projectData.category);
      if (projectData.projectDescription) formData.append('projectDescription', projectData.projectDescription);
      if (projectData.projectType) formData.append('projectType', projectData.projectType);
      if (projectData.projectLink) formData.append('projectLink', projectData.projectLink);
      if (projectData.status) formData.append('status', projectData.status);
      if (projectData.techStack) formData.append('techStack', projectData.techStack);
      
      // Append images
      images.forEach((image, index) => {
        // If image is Base64 string, convert to Blob
        if (typeof image === 'string' && image.startsWith('data:image')) {
          const blob = base64ToBlob(image);
          formData.append('images', blob, `image_${index}.jpg`);
        } else if (image instanceof File) {
          formData.append('images', image);
        }
      });
      
      const response = await apiClient.post(API_ENDPOINTS.PROJECTS.CREATE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  },
  
  async update(id, projectData, images = []) {
    try {
      const formData = new FormData();
      
      if (projectData.title) formData.append('title', projectData.title);
      if (projectData.clientName) formData.append('clientName', projectData.clientName);
      if (projectData.category) formData.append('category', projectData.category);
      if (projectData.projectDescription) formData.append('projectDescription', projectData.projectDescription);
      if (projectData.projectType) formData.append('projectType', projectData.projectType);
      if (projectData.projectLink) formData.append('projectLink', projectData.projectLink);
      if (projectData.status) formData.append('status', projectData.status);
      if (projectData.techStack) formData.append('techStack', projectData.techStack);
      
      images.forEach((image, index) => {
        if (typeof image === 'string' && image.startsWith('data:image')) {
          const blob = base64ToBlob(image);
          formData.append('images', blob, `image_${index}.jpg`);
        } else if (image instanceof File) {
          formData.append('images', image);
        }
      });
      
      const response = await apiClient.put(API_ENDPOINTS.PROJECTS.UPDATE(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      console.error(`Failed to update project ${id}:`, error);
      throw error;
    }
  },
  
  async delete(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.PROJECTS.DELETE(id));
      return response;
    } catch (error) {
      console.error(`Failed to delete project ${id}:`, error);
      throw error;
    }
  }
};

// Helper function to convert Base64 to Blob
function base64ToBlob(base64) {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  
  return new Blob([uInt8Array], { type: contentType });
}