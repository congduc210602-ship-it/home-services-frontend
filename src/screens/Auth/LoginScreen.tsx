// src/screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { authService } from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Tách riêng 2 biến loading để nút nào xoay nút nấy
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  // 1. XỬ LÝ ĐĂNG NHẬP BẰNG MẬT KHẨU
  const handleLoginPassword = async () => {
    if (!phone || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ số điện thoại và mật khẩu!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login({ phone, password });
      await AsyncStorage.setItem('userToken', response.access_token);

      Alert.alert('Thành công', 'Đăng nhập thành công!');
      navigation.navigate('Home');
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || 'Sai số điện thoại hoặc mật khẩu';
      Alert.alert('Lỗi', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. XỬ LÝ ĐĂNG NHẬP BẰNG OTP
  const handleLoginOTP = async () => {
    if (!phone) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại để nhận mã OTP!');
      return;
    }

    setIsOtpLoading(true);
    try {
      await authService.sendOtp({ phone });
      Alert.alert('Thông báo', 'Đã gửi mã OTP đến số điện thoại của bạn!');
      // Chuyển sang trang nhập OTP
      navigation.navigate('Otp', { phone: phone });
    } catch (error: any) {
      // Backend của bạn yêu cầu sđt phải TỒN TẠI mới cho gửi OTP
      const errorMsg = error.response?.data?.detail || 'Lỗi gửi OTP. Số điện thoại này đã đăng ký chưa?';
      Alert.alert('Lỗi', errorMsg);
    } finally {
      setIsOtpLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Nút 1: Đăng nhập bằng Mật khẩu */}
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLoginPassword}
        disabled={isLoading || isOtpLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Đang xử lý...' : 'Đăng nhập'}</Text>
      </TouchableOpacity>

      {/* Nút 2: Đăng nhập bằng OTP */}
      <TouchableOpacity
        style={[styles.otpButton, isOtpLoading && styles.buttonDisabled]}
        onPress={handleLoginOTP}
        disabled={isLoading || isOtpLoading}
      >
        <Text style={styles.otpButtonText}>{isOtpLoading ? 'Đang gửi mã...' : 'Đăng nhập bằng OTP'}</Text>
      </TouchableOpacity>

      {/* Link Đăng ký */}
      <TouchableOpacity
        style={{ marginTop: 25, alignItems: 'center' }}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={{ color: '#007BFF', fontSize: 16 }}>Chưa có tài khoản? Đăng ký ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16 },

  // Style cho nút Đăng nhập chính
  button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Style cho nút OTP (Nền trắng, viền xanh)
  otpButton: { backgroundColor: '#FFF', padding: 15, borderRadius: 8, alignItems: 'center', borderWidth: 1.5, borderColor: '#007BFF' },
  otpButtonText: { color: '#007BFF', fontSize: 16, fontWeight: 'bold' },

  buttonDisabled: { opacity: 0.6 }
});

export default LoginScreen;