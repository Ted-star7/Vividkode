import apiClient from "@/services/api/client";
import { API_ENDPOINTS } from "@/services/api/endpoints";

export const consultationsApi = {
  async list() {
    return apiClient.get(API_ENDPOINTS.CONSULTATIONS.LIST);
  },

  async getById(id) {
    return apiClient.get(API_ENDPOINTS.CONSULTATIONS.DETAIL(id));
  },

  async update(id, payload) {
    return apiClient.put(API_ENDPOINTS.CONSULTATIONS.UPDATE(id), payload);
  },

  async delete(id) {
    return apiClient.delete(API_ENDPOINTS.CONSULTATIONS.DELETE(id));
  },
};
