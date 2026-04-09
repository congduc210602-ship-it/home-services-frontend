import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import OtpScreen from '../screens/Auth/OtpScreen';
import OrderScreen from '../screens/Order/OrderScreen';
import OrderHistoryScreen from '../screens/Order/OrderHistoryScreen';
import ReviewScreen from '../screens/Order/ReviewScreen';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      {/* Màn hình chính */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      {/* Màn hình Đăng nhập */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Đăng nhập' }} // Hiển thị thanh tiêu đề trên cùng
      />
      {/* Màn hình Đặt lịch */}
      <Stack.Screen
        name="Order"
        component={OrderScreen}
        options={{ title: 'Đặt lịch' }}
      />
      {/* Màn hình Xác thực OTP */}
      <Stack.Screen
        name="Otp"
        component={OtpScreen}
        options={{ headerShown: false }} // Ẩn thanh tiêu đề mặc định vì ta đã code nút "Quay lại" tự làm
      />
      {/* Màn hình Lịch sử đặt lịch */}
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{ title: 'Lịch sử đặt lịch' }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Đăng ký' }}
      />
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={{ title: 'Đánh giá dịch vụ' }}
      />
    </Stack.Navigator>

  );
};

export default AppNavigator;