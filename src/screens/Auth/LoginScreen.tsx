// src/screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { authService } from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ số điện thoại và mật khẩu');
      return;
    }

    setIsLoading(true);
    try {
      // Gọi hàm login từ service bạn vừa viết lúc nãy
      const response = await authService.login({ phone, password });
      
      // Lưu token vào bộ nhớ máy để dùng cho các API sau
      await AsyncStorage.setItem('userToken', response.access_token);
      
      Alert.alert('Thành công', 'Đăng nhập thành công!');
      // Quay về trang chủ sau khi đăng nhập xong
      navigation.goBack(); 
      
    } catch (error: any) {
      // Nếu API trả về lỗi (sai pass, không tìm thấy user...)
      const errorMsg = error.response?.data?.detail || error.response?.data?.error || 'Đăng nhập thất bại';
      Alert.alert('Lỗi', errorMsg);
    } finally {
      setIsLoading(false);
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

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Đang xử lý...' : 'Đăng nhập'}</Text>
      </TouchableOpacity>

      {/* THÊM ĐOẠN NÀY */}
      <TouchableOpacity 
        style={{ marginTop: 20, alignItems: 'center' }} 
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
  button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#a0c4ff' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default LoginScreen;