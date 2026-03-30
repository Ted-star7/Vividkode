import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';

export const projectsApi = {
  /**
   * Get all projects
   */
  async getAll() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PROJECTS.LIST);
      return response;
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw error;
    }
  },
  
  /**
   * Get project by ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PROJECTS.DETAIL(id));
      return response;
    } catch (error) {
      console.error(`Failed to fetch project ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new project
   */
 async create(projectData, images = []) {
    try {
      // The API expects projectData as Query Parameters and images as a JSON body
      const response = await apiClient.post(
        API_ENDPOINTS.PROJECTS.CREATE, 
        { images: images }, // JSON Body
        { params: projectData } // Axios automatically builds the ?title=...&status=... string
      );
      
      return response;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing project
   */
  async update(id, projectData, images = []) {
    try {
      const formData = new FormData();
      
      Object.keys(projectData).forEach(key => {
        if (projectData[key] !== undefined && projectData[key] !== null) {
          formData.append(key, projectData[key]);
        }
      });
      
      images.forEach((image, index) => {
        formData.append('images', image);
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
  
  /**
   * Delete a project
   */
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