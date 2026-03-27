import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';

export const usersApi = {
  async getAll(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.LIST, { params });
      return response;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  },
  
  async getById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.DETAIL(id));
      return response;
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      throw error;
    }
  },
  
  async create(userData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USERS.LIST, userData);
      return response;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  },
  
  async update(id, userData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE(id), userData);
      return response;
    } catch (error) {
      console.error(`Failed to update user ${id}:`, error);
      throw error;
    }
  },
  
  async delete(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
      return response;
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error);
      throw error;
    }
  }
};