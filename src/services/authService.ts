// src/services/authService.ts
import apiClient from './apiClient';
import { API_CONFIG } from '../constants/config';
import { LoginRequest, RegisterRequest, AuthResponse, SendOtpRequest, VerifyOtpRequest } from '../types/index';

const BASE_URL = API_CONFIG.AUTH_URL;

export const authService = {
  // Gọi api /auth/login/password (Đã sửa lại cho khớp backend)
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post(`${BASE_URL}/auth/login/password`, data);
    return response.data;
  },

  // Gọi api /auth/register
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post(`${BASE_URL}/auth/register`, data);
    return response.data;
  },

  // Gửi OTP đến số điện thoại
  sendOtp: async (data: SendOtpRequest) => {
    const response = await apiClient.post(`${BASE_URL}/auth/send-otp`, data);
    return response.data;
  },

  // Xác thực OTP và trả về token
  verifyOtp: async (data: VerifyOtpRequest): Promise<AuthResponse> => {
    const response = await apiClient.post(`${BASE_URL}/auth/verify-otp`, data);
    return response.data;
  },
  
  // Lấy thông tin user
  getProfile: async (token: string) => {
    const response = await apiClient.get(`${BASE_URL}/auth/profile?token=${token}`);
    return response.data;
  }
};