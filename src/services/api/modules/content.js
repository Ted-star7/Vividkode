import apiClient from "@/services/api/client";
import { API_ENDPOINTS } from "@/services/api/endpoints";

export const contentApi = {
  async listVisionMission() {
    return apiClient.get(API_ENDPOINTS.VISION_MISSION.LIST);
  },

  async createVisionMission(payload) {
    return apiClient.post(API_ENDPOINTS.VISION_MISSION.CREATE, payload);
  },

  async getVisionMission(id) {
    return apiClient.get(API_ENDPOINTS.VISION_MISSION.DETAIL(id));
  },

  async updateVisionMission(id, payload) {
    return apiClient.put(API_ENDPOINTS.VISION_MISSION.UPDATE(id), payload);
  },

  async deleteVisionMission(id) {
    return apiClient.delete(API_ENDPOINTS.VISION_MISSION.DELETE(id));
  },

  async createTestimonial(payload) {
    return apiClient.post(API_ENDPOINTS.TESTIMONIALS.CREATE, payload);
  },

  async listTestimonials() {
    return apiClient.get(API_ENDPOINTS.TESTIMONIALS.LIST);
  },

  async getTestimonial(id) {
    return apiClient.get(API_ENDPOINTS.TESTIMONIALS.DETAIL(id));
  },

  async updateTestimonial(id, payload) {
    return apiClient.put(API_ENDPOINTS.TESTIMONIALS.UPDATE(id), payload);
  },

  async deleteTestimonial(id) {
    return apiClient.delete(API_ENDPOINTS.TESTIMONIALS.DELETE(id));
  },
};
