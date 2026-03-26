import { WebSocketClient } from './client';

let instance = null;

export const websocket = {
  init(url) {
    if (!instance) {
      instance = new WebSocketClient(url);
      instance.connect();
    }
    return instance;
  },
  
  getInstance() {
    if (!instance) {
      console.warn('WebSocket not initialized. Call init() first.');
      return null;
    }
    return instance;
  },
  
  disconnect() {
    if (instance) {
      instance.disconnect();
      instance = null;
    }
  },
  
  send(type, payload) {
    if (instance) {
      return instance.send(type, payload);
    }
    return false;
  },
  
  on(event, callback) {
    if (instance) {
      instance.on(event, callback);
    }
  },
  
  off(event, callback) {
    if (instance) {
      instance.off(event, callback);
    }
  }
};

// Also export the class for advanced use
export { WebSocketClient };