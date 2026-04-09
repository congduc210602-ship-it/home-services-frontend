// src/types/api.d.ts

// Dựa theo lớp UserCreate bên auth/main.py
export interface RegisterRequest {
  phone: string;
  full_name: string;
  password: string;
}

// Dựa theo lớp UserLogin bên auth/main.py
export interface LoginRequest {
  phone: string;
  password: string;
}

export interface SendOtpRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

// Dựa theo cấu trúc trả về Token bên auth/main.py
export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Dựa theo lớp OrderCreate bên order/main.py
export interface OrderCreateRequest {
  customer_phone: string;
  service_type: string;
  address: string;
  price: number;
}