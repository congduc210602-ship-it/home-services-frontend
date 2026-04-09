// src/screens/Order/OrderScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { orderService } from '../../services/orderService';

const PAYMENT_METHODS = [
    { id: 'COD', name: 'Tiền mặt (COD)', icon: '💵' },
    { id: 'MOMO', name: 'Ví MoMo', icon: '📱' },
    { id: 'VNPAY', name: 'VNPay', icon: '💳' },
];

const OrderScreen = ({ route, navigation }: any) => {
    const { serviceName, price } = route.params;

    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateOrder = async () => {
        if (!phone || !address) {
            Alert.alert('Thiếu thông tin', 'Vui lòng điền số điện thoại và địa chỉ thực hiện dịch vụ.');
            return;
        }

        setIsLoading(true);
        try {
            // Backend hiện tại chưa nhận trường payment_method, nhưng ta cứ truyền sẵn để sau này đồng nghiệp update Backend là ăn khớp ngay.
            await orderService.createOrder({
                customer_phone: phone,
                service_type: serviceName,
                address: address,
                price: price,
                // payment_method: paymentMethod  <-- Mở comment này khi Backend hỗ trợ
            });

            Alert.alert('🎉 Thành công', 'Đơn hàng của bạn đã được đưa lên hệ thống. Đang tìm thợ...', [
                { text: 'Xem lịch sử', onPress: () => navigation.navigate('OrderHistory') },
                { text: 'Về trang chủ', onPress: () => navigation.navigate('Home') }
            ]);
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể đặt lịch lúc này. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Dịch vụ đã chọn</Text>
                <Text style={styles.serviceName}>{serviceName}</Text>
                <Text style={styles.price}>{price.toLocaleString('vi-VN')} đ</Text>
            </View>

            <Text style={styles.sectionLabel}>Thông tin liên hệ</Text>
            <View style={styles.inputGroup}>
                <TextInput
                    style={styles.input}
                    placeholder="Số điện thoại của bạn"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />
                <TextInput
                    style={[styles.input, { height: 80, textAlignVertical: 'top', marginTop: 10 }]}
                    placeholder="Địa chỉ chi tiết (Số nhà, đường...)"
                    multiline
                    value={address}
                    onChangeText={setAddress}
                />
            </View>

            <Text style={styles.sectionLabel}>Phương thức thanh toán</Text>
            <View style={styles.paymentContainer}>
                {PAYMENT_METHODS.map((method) => (
                    <TouchableOpacity
                        key={method.id}
                        style={[styles.paymentOption, paymentMethod === method.id && styles.paymentOptionActive]}
                        onPress={() => setPaymentMethod(method.id)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.paymentLeft}>
                            <Text style={styles.paymentIcon}>{method.icon}</Text>
                            <Text style={[styles.paymentText, paymentMethod === method.id && styles.paymentTextActive]}>{method.name}</Text>
                        </View>
                        {/* Dấu chấm tròn (Radio button custom) */}
                        <View style={[styles.radioCircle, paymentMethod === method.id && styles.radioCircleActive]}>
                            {paymentMethod === method.id && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
                onPress={handleCreateOrder}
                disabled={isLoading}
            >
                <Text style={styles.submitBtnText}>
                    {isLoading ? 'Đang xử lý...' : `Xác nhận đặt - ${price.toLocaleString('vi-VN')} đ`}
                </Text>
            </TouchableOpacity>

            {/* Khoảng trống bên dưới để cuộn không bị vướng */}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F6F9', padding: 20 },

    summaryCard: { backgroundColor: '#1A73E8', borderRadius: 16, padding: 20, marginBottom: 25, shadowColor: '#1A73E8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    summaryTitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 8 },
    serviceName: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    price: { color: '#FFF', fontSize: 24, fontWeight: '900' },

    sectionLabel: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12, marginLeft: 4 },

    inputGroup: { backgroundColor: '#FFF', borderRadius: 16, padding: 15, marginBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    input: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#EEE', borderRadius: 10, padding: 15, fontSize: 16, color: '#333' },

    paymentContainer: { backgroundColor: '#FFF', borderRadius: 16, padding: 10, marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    paymentOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: 'transparent' },
    paymentOptionActive: { backgroundColor: '#F0F4FF', borderColor: '#D6E4FF' },
    paymentLeft: { flexDirection: 'row', alignItems: 'center' },
    paymentIcon: { fontSize: 24, marginRight: 15 },
    paymentText: { fontSize: 16, color: '#555', fontWeight: '500' },
    paymentTextActive: { color: '#1A73E8', fontWeight: '700' },

    radioCircle: { height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: '#CCC', alignItems: 'center', justifyContent: 'center' },
    radioCircleActive: { borderColor: '#1A73E8' },
    radioInner: { height: 10, width: 10, borderRadius: 5, backgroundColor: '#1A73E8' },

    submitBtn: { backgroundColor: '#1A73E8', paddingVertical: 18, borderRadius: 16, alignItems: 'center', shadowColor: '#1A73E8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    submitBtnDisabled: { backgroundColor: '#A0C4FF', shadowOpacity: 0 },
    submitBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});

export default OrderScreen;