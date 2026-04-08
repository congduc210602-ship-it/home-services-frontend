import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { orderService } from '../../services/orderService';

const OrderHistoryScreen = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            // Gọi API lấy danh sách đơn hàng từ cổng 8002
            const response = await orderService.getListOrders();
            // Backend trả về object có key "orders" chứa mảng dữ liệu
            setOrders(response.orders || []);
        } catch (error) {
            console.log('Lỗi lấy đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderOrderItem = ({ item }: any) => (
        <View style={styles.card}>
            <View style={styles.headerCard}>
                <Text style={styles.serviceName}>{item.service_type}</Text>
                <Text style={styles.status}>{item.status}</Text>
            </View>
            <Text style={styles.detail}>SĐT: {item.customer_phone}</Text>
            <Text style={styles.detail}>Địa chỉ: {item.address}</Text>
            <Text style={styles.price}>Tổng: {item.price.toLocaleString('vi-VN')} VNĐ</Text>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#007BFF" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đơn hàng của bạn</Text>
            {orders.length === 0 ? (
                <Text style={styles.emptyText}>Bạn chưa đặt dịch vụ nào.</Text>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    renderItem={renderOrderItem}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
    headerCard: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    serviceName: { fontSize: 18, fontWeight: 'bold', color: '#0056b3' },
    status: { fontSize: 14, color: '#f39c12', fontWeight: 'bold', textTransform: 'uppercase' },
    detail: { fontSize: 15, color: '#555', marginBottom: 5 },
    price: { fontSize: 16, color: '#28a745', fontWeight: 'bold', marginTop: 10, textAlign: 'right' },
    emptyText: { textAlign: 'center', color: '#888', marginTop: 50, fontSize: 16 }
});

export default OrderHistoryScreen;