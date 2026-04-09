// src/screens/Auth/OtpScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';

const OtpScreen = ({ route, navigation }: any) => {
    // Nhận số điện thoại từ màn hình Đăng nhập/Đăng ký truyền sang
    const phone = route.params?.phone || '090x.xxx.xxx';

    const [otp, setOtp] = useState(['', '', '', '']); // Mã OTP 4 số
    const [timer, setTimer] = useState(60); // Đếm ngược 60s
    const inputRefs = useRef<Array<any>>([]);

    // Chạy bộ đếm ngược
    useEffect(() => {
        let interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Xử lý khi nhập số
    const handleChange = (text: string, index: number) => {
        // Chỉ lấy 1 ký tự số
        const value = text.replace(/[^0-9]/g, '').slice(-1);
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Tự động nhảy sang ô tiếp theo nếu có nhập số
        if (value && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Xử lý khi bấm nút xóa (Backspace)
    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            // Nếu ô hiện tại rỗng và bấm xóa, lùi về ô trước đó
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = () => {
        const otpCode = otp.join('');
        if (otpCode.length < 4) {
            Alert.alert('Lỗi', 'Vui lòng nhập đủ 4 số OTP');
            return;
        }

        // Ở đây sau này sẽ gọi API kiểm tra OTP với Backend
        console.log('Mã OTP gửi đi:', otpCode);

        Alert.alert('Thành công', 'Xác thực số điện thoại thành công!', [
            { text: 'Vào Trang chủ', onPress: () => navigation.navigate('Home') }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <View style={styles.content}>

                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text style={styles.backText}>← Quay lại</Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>Xác thực OTP</Text>
                    <Text style={styles.subtitle}>
                        Chúng tôi vừa gửi mã gồm 4 chữ số đến số điện thoại {'\n'}
                        <Text style={styles.highlightPhone}>{phone}</Text>
                    </Text>

                    {/* Khu vực 4 ô nhập OTP */}
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                // ĐÃ SỬA LỖI TYPESCRIPT Ở DÒNG NÀY:
                                ref={(ref) => { inputRefs.current[index] = ref; }}
                                style={[styles.otpInput, digit ? styles.otpInputActive : null]}
                                keyboardType="number-pad"
                                maxLength={1}
                                value={digit}
                                onChangeText={(text) => handleChange(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                selectTextOnFocus
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.verifyBtn, otp.join('').length === 4 ? styles.verifyBtnActive : null]}
                        onPress={handleVerify}
                        disabled={otp.join('').length < 4}
                    >
                        <Text style={styles.verifyBtnText}>Xác nhận</Text>
                    </TouchableOpacity>

                    <View style={styles.resendContainer}>
                        <Text style={styles.resendText}>Chưa nhận được mã? </Text>
                        {timer > 0 ? (
                            <Text style={styles.timerText}>Gửi lại sau {timer}s</Text>
                        ) : (
                            <TouchableOpacity onPress={() => setTimer(60)}>
                                <Text style={styles.resendAction}>Gửi lại mã</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    content: { flex: 1, paddingHorizontal: 25, paddingTop: 40 },
    backBtn: { alignSelf: 'flex-start', marginBottom: 30, paddingVertical: 10 },
    backText: { fontSize: 16, color: '#1A73E8', fontWeight: '600' },

    title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    subtitle: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 40 },
    highlightPhone: { fontWeight: 'bold', color: '#1A1A1A' },

    otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
    otpInput: { width: 65, height: 65, borderRadius: 12, borderWidth: 1.5, borderColor: '#DDD', backgroundColor: '#F8F9FA', fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#333' },
    otpInputActive: { borderColor: '#1A73E8', backgroundColor: '#F0F4FF' },

    verifyBtn: { backgroundColor: '#A0C4FF', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginBottom: 25 },
    verifyBtnActive: { backgroundColor: '#1A73E8', shadowColor: '#1A73E8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    verifyBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

    resendContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    resendText: { fontSize: 15, color: '#666' },
    timerText: { fontSize: 15, color: '#999', fontWeight: '600' },
    resendAction: { fontSize: 15, color: '#1A73E8', fontWeight: 'bold' }
});

export default OtpScreen;