// API
export { default as apiClient } from './api/client';
export { API_ENDPOINTS } from './api/endpoints';
export { authApi } from './api/modules/auth';
export { usersApi } from './api/modules/users';
export { projectsApi } from './api/modules/projects';


// Storage
export { cookieStorage } from './storage/cookie';
export { cookieStorage as storage } from './storage/cookie';
// import { cookieStorage } from "@/storage/cookie";

// WebSocket
export { websocket } from './websocket';

// Optional: Export WebSocketClient if needed
export { WebSocketClient } from './websocket/client';