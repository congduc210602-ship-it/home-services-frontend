// src/screens/Home/HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView, StatusBar } from 'react-native';

// Mở rộng dữ liệu mẫu để test bộ lọc
const SERVICES_DATA = [
  { id: '1', name: 'Dọn dẹp nhà cửa', category: 'Vệ sinh', price: 150000, icon: '🧹', color: '#E8F5E9' },
  { id: '2', name: 'Sửa chữa điện', category: 'Sửa chữa', price: 200000, icon: '⚡', color: '#FFF3E0' },
  { id: '3', name: 'Sửa ống nước', category: 'Sửa chữa', price: 250000, icon: '🚰', color: '#E3F2FD' },
  { id: '4', name: 'Vệ sinh máy lạnh', category: 'Điện lạnh', price: 200000, icon: '❄️', color: '#E0F7FA' },
  { id: '5', name: 'Giặt sấy rèm thảm', category: 'Vệ sinh', price: 300000, icon: '🧺', color: '#F3E5F5' },
];

const CATEGORIES = ['Tất cả', 'Vệ sinh', 'Sửa chữa', 'Điện lạnh'];

const HomeScreen = ({ navigation }: any) => {
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  // Logic Lọc & Tìm kiếm
  const filteredServices = SERVICES_DATA.filter(service => {
    const matchCategory = activeCategory === 'Tất cả' || service.category === activeCategory;
    const matchSearch = service.name.toLowerCase().includes(searchText.toLowerCase());
    return matchCategory && matchSearch;
  });

  const renderServiceItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.serviceCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('Order', { serviceName: item.name, price: item.price })}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceCategory}>{item.category}</Text>
        <Text style={styles.price}>{item.price.toLocaleString('vi-VN')} đ</Text>
      </View>
      <View style={styles.bookButton}>
        <Text style={styles.bookButtonText}>Đặt ngay</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header Profile */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Xin chào,</Text>
          <Text style={styles.userName}>Đức ✌️</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {/* Nút Đăng nhập tạm thời để test */}
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={[styles.historyBtn, { backgroundColor: '#FFF3E0' }]}>
            <Text style={{ color: '#F57C00', fontWeight: 'bold' }}>👤 Đăng nhập</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('OrderHistory')} style={styles.historyBtn}>
            <Text style={styles.historyText}>📋 Lịch sử</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Bạn đang cần dịch vụ gì?"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Categories Filter */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryChip, activeCategory === item && styles.activeCategoryChip]}
              onPress={() => setActiveCategory(item)}
            >
              <Text style={[styles.categoryText, activeCategory === item && styles.activeCategoryText]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Services List */}
      <Text style={styles.sectionTitle}>Dịch vụ phổ biến</Text>
      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id}
        renderItem={renderServiceItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9', paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 25 },
  greeting: { fontSize: 16, color: '#666' },
  userName: { fontSize: 24, fontWeight: '800', color: '#1A1A1A' },
  historyBtn: { backgroundColor: '#E8F0FE', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  historyText: { color: '#1A73E8', fontWeight: 'bold' },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 15, paddingHorizontal: 15, paddingVertical: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, marginBottom: 20 },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },

  categoryContainer: { marginBottom: 25 },
  categoryChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, backgroundColor: '#FFF', marginRight: 10, borderWidth: 1, borderColor: '#EEE' },
  activeCategoryChip: { backgroundColor: '#1A73E8', borderColor: '#1A73E8' },
  categoryText: { fontSize: 14, color: '#666', fontWeight: '600' },
  activeCategoryText: { color: '#FFF' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },

  serviceCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 15, marginBottom: 15, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  iconContainer: { width: 60, height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  icon: { fontSize: 30 },
  cardInfo: { flex: 1 },
  serviceName: { fontSize: 16, fontWeight: '700', color: '#2C3E50', marginBottom: 4 },
  serviceCategory: { fontSize: 13, color: '#7F8C8D', marginBottom: 6 },
  price: { fontSize: 15, color: '#E74C3C', fontWeight: 'bold' },
  bookButton: { backgroundColor: '#F8F9FA', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#EEE' },
  bookButtonText: { color: '#1A73E8', fontSize: 12, fontWeight: 'bold' }
});

export default HomeScreen;