// src/screens/Order/ReviewScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';

const ReviewScreen = ({ route, navigation }: any) => {
    // Lấy thông tin đơn hàng được truyền sang
    const { orderId, serviceName } = route.params || { orderId: 'DH123', serviceName: 'Dọn dẹp nhà cửa' };

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const submitReview = () => {
        if (rating === 0) {
            Alert.alert('Thông báo', 'Vui lòng chọn số sao đánh giá nhé!');
            return;
        }

        // Ở đây sau này sẽ gọi API lưu xuống Backend
        console.log(`Đã gửi đánh giá: ${rating} sao, Nhận xét: ${comment}`);

        Alert.alert('Cảm ơn bạn!', 'Đánh giá của bạn giúp dịch vụ ngày càng tốt hơn.', [
            { text: 'Về lịch sử', onPress: () => navigation.goBack() }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Đánh giá dịch vụ</Text>
                <Text style={styles.serviceName}>{serviceName}</Text>
                <Text style={styles.subtitle}>Bạn cảm thấy chất lượng phục vụ thế nào?</Text>

                {/* Hệ thống chấm sao */}
                <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
                            <Text style={[styles.star, star <= rating ? styles.starSelected : styles.starUnselected]}>
                                ★
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Text style={styles.ratingText}>
                    {rating === 5 ? 'Tuyệt vời!' : rating === 4 ? 'Rất tốt' : rating === 3 ? 'Bình thường' : rating === 2 ? 'Tệ' : 'Rất tệ'}
                </Text>

                {/* Ô nhập nhận xét */}
                <TextInput
                    style={styles.commentInput}
                    placeholder="Chia sẻ trải nghiệm của bạn (không bắt buộc)..."
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={4}
                    value={comment}
                    onChangeText={setComment}
                />

                <TouchableOpacity style={styles.submitBtn} onPress={submitReview}>
                    <Text style={styles.submitBtnText}>Gửi đánh giá</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F6F9', padding: 20, justifyContent: 'center' },
    card: { backgroundColor: '#FFF', borderRadius: 20, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    serviceName: { fontSize: 18, color: '#1A73E8', fontWeight: '600', marginBottom: 20 },
    subtitle: { fontSize: 15, color: '#666', marginBottom: 20 },

    starsContainer: { flexDirection: 'row', marginBottom: 10 },
    star: { fontSize: 45, marginHorizontal: 5 },
    starSelected: { color: '#FFD700' }, // Màu vàng
    starUnselected: { color: '#E0E0E0' }, // Màu xám

    ratingText: { fontSize: 16, fontWeight: 'bold', color: '#FFD700', marginBottom: 25 },

    commentInput: { width: '100%', backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#EEE', borderRadius: 12, padding: 15, fontSize: 15, color: '#333', height: 100, textAlignVertical: 'top', marginBottom: 25 },

    submitBtn: { width: '100%', backgroundColor: '#1A73E8', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
    submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});

export default ReviewScreen;