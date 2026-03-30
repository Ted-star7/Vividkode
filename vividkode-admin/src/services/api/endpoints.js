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
  },
  USERS: {
    LIST: '/api/users',
    DETAIL: (id) => `/api/users/${id}`,
    UPDATE: (id) => `/api/users/${id}`,
    DELETE: (id) => `/api/users/${id}`,
  }
};