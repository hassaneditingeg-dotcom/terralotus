import React, { useState } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header, ProductCard, SectionHeader } from '../components/UI';
import { PRODUCTS, CATEGORIES, getProductsByCategory } from '../data/products';
import { COLORS, FONTS } from '../theme';

export default function ShopScreen({ navigation }) {
  const [category, setCategory] = useState('All');
  const insets = useSafeAreaInsets();
  const products = getProductsByCategory(category);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <Header navigation={navigation} />
      <FlatList
        data={products}
        keyExtractor={p => p.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 11, paddingHorizontal: 18 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        ListHeaderComponent={() => (
          <View style={{ padding: 18, paddingBottom: 10 }}>
            <SectionHeader eyebrow="Terra Lotus" title="All Products" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }} contentContainerStyle={{ gap: 7 }}>
              {CATEGORIES.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.chip, category === c && styles.chipOn]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={[styles.chipText, category === c && styles.chipTextOn]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <ProductCard
              product={item}
              wide
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 99, borderWidth: 0.5, borderColor: 'rgba(201,164,74,0.33)', backgroundColor: COLORS.offWhite },
  chipOn: { backgroundColor: COLORS.deepBrown, borderColor: COLORS.deepBrown },
  chipText: { fontFamily: FONTS.heading, fontSize: 9, letterSpacing: 1, color: COLORS.darkGray },
  chipTextOn: { color: COLORS.honeyGold },
});
