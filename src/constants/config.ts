// src/constants/config.ts
import { Platform } from 'react-native';

// Dùng 10.0.2.2 cho Android Emulator, dùng localhost cho iOS Simulator
const BASE_DOMAIN = Platform.OS === 'android' ? 'http://10.0.2.2' : 'http://localhost';

export const API_CONFIG = {
  AUTH_URL: `${BASE_DOMAIN}:8001`,
  ORDER_URL: `${BASE_DOMAIN}:8002`,
  WORKER_URL: `${BASE_DOMAIN}:8003`,
  MATCHING_URL: `${BASE_DOMAIN}:8004`,
};