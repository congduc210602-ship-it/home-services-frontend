// src/services/orderService.ts
import apiClient from './apiClient';
import { API_CONFIG } from '../constants/config';
import { OrderCreateRequest } from '../types';

const BASE_URL = API_CONFIG.ORDER_URL;

export const orderService = {
    // Hàm tạo đơn hàng mới
    createOrder: async (data: OrderCreateRequest) => {
        const response = await apiClient.post(`${BASE_URL}/order/create`, data);
        return response.data;
    },

    // Hàm lấy danh sách đơn hàng đã đặt
    getListOrders: async () => {
        const response = await apiClient.get(`${BASE_URL}/order/list`);
        return response.data;
    }
};