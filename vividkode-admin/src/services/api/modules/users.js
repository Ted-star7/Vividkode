import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';

export const usersApi = {
  /**
   * Get all users (admin only)
   * @param {Object} params - Query parameters (page, limit, search, etc.)
   */
  async getAll(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.LIST, { params });
      return response;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  },
  
  /**
   * Get user by ID
   * @param {string|number} id - User ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.DETAIL(id));
      return response;
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create new user
   * @param {Object} userData - User data (name, email, role, etc.)
   */
  async create(userData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USERS.LIST, userData);
      return response;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  },
  
  /**
   * Update user
   * @param {string|number} id - User ID
   * @param {Object} userData - Updated user data
   */
  async update(id, userData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE(id), userData);
      return response;
    } catch (error) {
      console.error(`Failed to update user ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete user
   * @param {string|number} id - User ID
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
      return response;
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Update user role
   * @param {string|number} id - User ID
   * @param {string} role - New role
   */
  async updateRole(id, role) {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.USERS.UPDATE(id), { role });
      return response;
    } catch (error) {
      console.error(`Failed to update user role ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Invite new user
   * @param {Object} inviteData - Email, role, etc.
   */
  async inviteUser(inviteData) {
    try {
      const response = await apiClient.post('/api/users/invite', inviteData);
      return response;
    } catch (error) {
      console.error('Failed to invite user:', error);
      throw error;
    }
  },
  
  /**
   * Change user status (activate/deactivate)
   * @param {string|number} id - User ID
   * @param {boolean} isActive - Active status
   */
  async changeStatus(id, isActive) {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.USERS.UPDATE(id), { 
        is_active: isActive 
      });
      return response;
    } catch (error) {
      console.error(`Failed to change user status ${id}:`, error);
      throw error;
    }
  }
};