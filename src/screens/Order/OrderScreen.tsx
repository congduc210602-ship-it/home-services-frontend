// src/screens/Order/OrderScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { orderService } from '../../services/orderService';

const OrderScreen = ({ route, navigation }: any) => {
    // Lấy dữ liệu dịch vụ được truyền từ trang chủ sang
    const { serviceName, price } = route.params;

    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateOrder = async () => {
        if (!phone || !address) {
            Alert.alert('Lỗi', 'Vui lòng điền số điện thoại và địa chỉ thực hiện dịch vụ');
            return;
        }

        setIsLoading(true);
        try {
            await orderService.createOrder({
                customer_phone: phone,
                service_type: serviceName,
                address: address,
                price: price
            });

            Alert.alert('Thành công', 'Đã đặt dịch vụ! Đang tìm thợ phù hợp...', [
                { text: 'Về trang chủ', onPress: () => navigation.navigate('Home') }
            ]);
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể đặt lịch lúc này. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Xác nhận đặt lịch</Text>

            <View style={styles.card}>
                <Text style={styles.serviceName}>Dịch vụ: {serviceName}</Text>
                <Text style={styles.price}>Chi phí dự kiến: {price.toLocaleString('vi-VN')} VNĐ</Text>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Số điện thoại liên hệ"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
            />

            <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Địa chỉ nhà bạn (Số nhà, đường, phường/xã...)"
                multiline
                value={address}
                onChangeText={setAddress}
            />

            <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleCreateOrder}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>{isLoading ? 'Đang tạo đơn...' : 'Xác nhận đặt'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20, elevation: 2 },
    serviceName: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
    price: { fontSize: 16, color: '#28a745', fontWeight: 'bold' },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16 },
    button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonDisabled: { backgroundColor: '#a0c4ff' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default OrderScreen;