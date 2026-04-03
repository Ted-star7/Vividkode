export const API_ENDPOINTS = {
  AUTH: {
    // Open endpoints (no auth required)
    LOGIN_V1: '/api/open/auth/login/v1',
    LOGIN_V2: '/api/open/auth/login/v2',
    FORGOT_PASSWORD: '/api/open/auth/forgot-password',
    RESET_PASSWORD: '/api/open/auth/reset-password',
    RESEND_OTP: '/api/open/auth/resend-otp',
    
    // Protected endpoints (auth required)
    CHANGE_PASSWORD: '/api/auth/change-password',
    VERIFY_OTP: '/api/auth/verify-otp',
    REFRESH_TOKEN: '/api/auth/refresh-token',
  },
  PROJECTS: {
    LIST: '/api/projects',
    DETAIL: (id) => `/api/projects/${id}`,
    CREATE: '/api/projects/create',
    UPDATE: (id) => `/api/projects/update/${id}`,
    DELETE: (id) => `/api/projects/delete/${id}`,
    STATS: '/api/projects/stats'
  },
  TESTIMONIALS: {
    LIST: '/api/open/testimonials',
    CREATE: '/api/testimonials',
    DETAIL: (id) => `/api/testimonials/${id}`,
    UPDATE: (id) => `/api/testimonials/${id}`,
    DELETE: (id) => `/api/testimonials/${id}`,
  },
  VISION_MISSION: {
    LIST: '/api/open/vission-mission',
    CREATE: '/api/vission-mission',
    DETAIL: (id) => `/api/vission-mission/${id}`,
    UPDATE: (id) => `/api/vission-mission/${id}`,
    DELETE: (id) => `/api/vission-mission/${id}`,
  },
  USERS: {
    LIST: '/api/users',
    DETAIL: (id) => `/api/users/${id}`,
    UPDATE: (id) => `/api/users/${id}`,
    DELETE: (id) => `/api/users/${id}`,

  },
  CONSULTATIONS: {
    LIST: '/api/consultations',
    DETAIL: (id) => `/api/consultations/${id}`,
    UPDATE: (id) => `/api/consultations/${id}`,
    DELETE: (id) => `/api/consultations/${id}`,
  },
  CLIENTS: {
    LIST: '/api/clients',
    CREATE: '/api/clients',
    DETAIL: (id) => `/api/clients/${id}`,
    UPDATE: (id) => `/api/clients/${id}`,
    DELETE: (id) => `/api/clients/${id}`,
    BY_STATUS: (status) => `/api/clients/status/${encodeURIComponent(status)}`,
    STATUS_COUNT: '/api/clients/status/count',
  },
};