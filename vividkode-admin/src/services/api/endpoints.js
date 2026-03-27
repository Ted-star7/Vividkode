// import { C } from "vue-router/dist/router-CWoNjPRp.mjs";

export const API_ENDPOINTS = {
  LOGIN_V1: "/api/open/auth/login/v1",
  LOGIN_V2: "/api/open/auth/login/v2",
  FORGOT_PASSWORD: "/api/open/auth/forgot-password",
  RESET_PASSWORD: "/api/open/auth/reset-password",
  RESEND_OTP: "/api/open/auth/resend-otp",

  /// Projects Controller

  CREATE_PROJECT: "/api/projects/create",
  GET_PROJECTS: "/api/projects",
  GET_PROJECT: (projectId) => `/api/projects/${projectId}`,
  UPDATE_PROJECT: (projectId) => `/api/projects/delete/${projectId}`,
  DELETE_PROJECT: (projectId) => `/api/projects/delete/${projectId}`,
};
