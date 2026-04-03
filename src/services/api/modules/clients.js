import apiClient from "@/services/api/client";
import { API_ENDPOINTS } from "@/services/api/endpoints";

export const clientsApi = {
  async list() {
    return apiClient.get(API_ENDPOINTS.CLIENTS.LIST);
  },

  async create(payload) {
    return apiClient.post(API_ENDPOINTS.CLIENTS.CREATE, payload);
  },

  async getById(id) {
    return apiClient.get(API_ENDPOINTS.CLIENTS.DETAIL(id));
  },

  async update(id, payload) {
    return apiClient.put(API_ENDPOINTS.CLIENTS.UPDATE(id), payload);
  },

  async delete(id) {
    return apiClient.delete(API_ENDPOINTS.CLIENTS.DELETE(id));
  },

  async listByStatus(status) {
    return apiClient.get(API_ENDPOINTS.CLIENTS.BY_STATUS(status));
  },

  async statusCount() {
    return apiClient.get(API_ENDPOINTS.CLIENTS.STATUS_COUNT);
  },
};
