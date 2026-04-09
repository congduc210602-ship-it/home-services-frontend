// src/screens/Auth/OtpScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { authService } from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OtpScreen = ({ route, navigation }: any) => {
    const phone = route.params?.phone || '';

    // Nâng cấp lên 6 ô OTP để khớp với Backend
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef<Array<any>>([]);

    useEffect(() => {
        let interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (text: string, index: number) => {
        const value = text.replace(/[^0-9]/g, '').slice(-1);
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Tự động nhảy sang ô tiếp theo (giới hạn ở ô thứ 5, tức là ô thứ 6 trong mảng)
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleResend = async () => {
        try {
            await authService.sendOtp({ phone });
            setTimer(60);
            Alert.alert('Thành công', 'Đã gửi lại mã OTP mới!');
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể gửi lại mã lúc này');
        }
    };

    const handleVerify = async () => {
        const otpCode = otp.join('');
        if (otpCode.length < 6) {
            Alert.alert('Lỗi', 'Vui lòng nhập đủ 6 số OTP');
            return;
        }

        setIsLoading(true);
        try {
            // Gọi API Verify OTP
            const response = await authService.verifyOtp({ phone, otp: otpCode });

            // Lưu Token và cho vào nhà
            await AsyncStorage.setItem('userToken', response.access_token);
            Alert.alert('Thành công', 'Xác thực thành công!');
            navigation.navigate('Home');

        } catch (error: any) {
            const errorMsg = error.response?.data?.detail || 'Mã OTP không đúng hoặc đã hết hạn';
            Alert.alert('Lỗi', errorMsg);
        } finally {
            setIsLoading(false);
        }
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
                        Chúng tôi vừa gửi mã gồm 6 chữ số đến số điện thoại {'\n'}
                        <Text style={styles.highlightPhone}>{phone}</Text>
                    </Text>

                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
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
                        style={[styles.verifyBtn, otp.join('').length === 6 && !isLoading ? styles.verifyBtnActive : null]}
                        onPress={handleVerify}
                        disabled={otp.join('').length < 6 || isLoading}
                    >
                        <Text style={styles.verifyBtnText}>{isLoading ? 'Đang kiểm tra...' : 'Xác nhận'}</Text>
                    </TouchableOpacity>

                    <View style={styles.resendContainer}>
                        <Text style={styles.resendText}>Chưa nhận được mã? </Text>
                        {timer > 0 ? (
                            <Text style={styles.timerText}>Gửi lại sau {timer}s</Text>
                        ) : (
                            <TouchableOpacity onPress={handleResend}>
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
    content: { flex: 1, paddingHorizontal: 20, paddingTop: 40 },
    backBtn: { alignSelf: 'flex-start', marginBottom: 30, paddingVertical: 10 },
    backText: { fontSize: 16, color: '#1A73E8', fontWeight: '600' },

    title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    subtitle: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 40 },
    highlightPhone: { fontWeight: 'bold', color: '#1A1A1A' },

    otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
    // Mình chỉnh lại kích thước ô một chút để nhét vừa 6 ô vào màn hình
    otpInput: { width: 45, height: 55, borderRadius: 10, borderWidth: 1.5, borderColor: '#DDD', backgroundColor: '#F8F9FA', fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#333' },
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