// src/services/authService.ts
import apiClient from './apiClient';
import { API_CONFIG } from '../constants/config';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/index';

const BASE_URL = API_CONFIG.AUTH_URL;

export const authService = {
  // Gọi api /auth/login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post(`${BASE_URL}/auth/login`, data);
    return response.data;
  },

  // Gọi api /auth/register
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post(`${BASE_URL}/auth/register`, data);
    return response.data;
  },
  
  // Lấy thông tin user
  getProfile: async (token: string) => {
    const response = await apiClient.get(`${BASE_URL}/auth/profile?token=${token}`);
    return response.data;
  }
};