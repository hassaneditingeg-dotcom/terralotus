import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header, ProductCard, GoldButton, SectionHeader } from '../components/UI';
import { getProductById } from '../data/products';
import { useWishlist } from '../context/WishlistContext';
import { COLORS, FONTS } from '../theme';

export default function WishlistScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { items } = useWishlist();
  const products = items.map(id => getProductById(id)).filter(Boolean);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <Header navigation={navigation} />
      {products.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 52, marginBottom: 12 }}>♡</Text>
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={styles.emptySub}>Tap the heart on any product page to save it here</Text>
          <GoldButton title="EXPLORE PRODUCTS" onPress={() => navigation.navigate('Shop')} style={{ width: 200, marginTop: 20 }} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={p => p.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 11, paddingHorizontal: 18 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          ListHeaderComponent={() => (
            <View style={{ padding: 18, paddingBottom: 10 }}>
              <SectionHeader eyebrow="My Saved Items" title={`Wishlist (${products.length})`} />
            </View>
          )}
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <ProductCard product={item} wide onPress={() => navigation.navigate('ProductDetail', { productId: item.id })} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { fontFamily: FONTS.heading, fontSize: 18, color: COLORS.deepBrown, marginBottom: 8 },
  emptySub: { fontFamily: FONTS.bodyItalic, fontSize: 14, color: COLORS.lightGray, textAlign: 'center', lineHeight: 20 },
});
