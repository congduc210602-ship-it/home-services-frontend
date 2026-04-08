// src/screens/Home/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const SERVICES_DATA = [
  { id: '1', name: 'Dọn dẹp nhà cửa', price: 150000, icon: '🧹' },
  { id: '2', name: 'Sửa chữa điện', price: 200000, icon: '⚡' },
  { id: '3', name: 'Sửa ống nước', price: 250000, icon: '🚰' },
  { id: '4', name: 'Vệ sinh máy lạnh', price: 200000, icon: '❄️' },
];

const HomeScreen = ({ navigation }: any) => {

  const renderServiceItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      // Chuyển sang màn hình Order và truyền theo tên dịch vụ, giá tiền
      onPress={() => navigation.navigate('Order', { serviceName: item.name, price: item.price })}
    >
      <Text style={styles.icon}>{item.icon}</Text>
      <View style={styles.cardInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.price}>{item.price.toLocaleString('vi-VN')} VNĐ</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dịch vụ tại nhà</Text>
        <View style={{ flexDirection: 'row', gap: 15 }}>
          {/* Nút xem lịch sử */}
          <TouchableOpacity onPress={() => navigation.navigate('OrderHistory')}>
            <Text style={[styles.loginText, { color: '#28a745' }]}>Lịch sử</Text>
          </TouchableOpacity>
          {/* Nút đăng nhập */}
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subtitle}>Chọn dịch vụ bạn cần hôm nay:</Text>

      <FlatList
        data={SERVICES_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderServiceItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  loginText: { color: '#007BFF', fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  icon: { fontSize: 35, marginRight: 15 },
  cardInfo: { flex: 1 },
  serviceName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  price: { fontSize: 15, color: '#28a745', fontWeight: '600' }
});

export default HomeScreen;