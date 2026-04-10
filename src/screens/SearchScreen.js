import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductCard } from '../components/UI';
import { PRODUCTS } from '../data/products';
import { COLORS, FONTS, RADIUS, SHADOW } from '../theme';

const TRENDING = ['Tallow Balm', 'Unscented', 'Lavender', 'Soap', 'Deodorant', 'Hair Oil', 'SPF 50'];

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const insets = useSafeAreaInsets();
  const q = query.toLowerCase();
  const results = q ? PRODUCTS.filter(p =>
    p.short.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.scents.some(s => s.toLowerCase().includes(q))
  ) : [];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
      {/* Search bar */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <View style={styles.bar}>
          <Text style={{ fontSize: 15, color: COLORS.lightGray }}>🔍</Text>
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="Search products, ingredients…"
            placeholderTextColor="#B0A090"
            autoFocus
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={{ fontSize: 13, color: COLORS.lightGray }}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {!q ? (
        <View style={{ padding: 18 }}>
          <Text style={styles.trendLabel}>TRENDING SEARCHES</Text>
          <View style={styles.trendWrap}>
            {TRENDING.map(t => (
              <TouchableOpacity key={t} style={styles.chip} onPress={() => setQuery(t)}>
                <Text style={styles.chipText}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : results.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>🌿</Text>
          <Text style={{ fontFamily: FONTS.heading, fontSize: 15, color: COLORS.deepBrown }}>No results for "{query}"</Text>
          <Text style={{ fontFamily: FONTS.bodyItalic, fontSize: 13, color: COLORS.lightGray, marginTop: 6 }}>Try searching by scent, category, or ingredient</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={p => p.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 11, paddingHorizontal: 18 }}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: insets.bottom + 20 }}
          ListHeaderComponent={() => (
            <Text style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.lightGray, paddingHorizontal: 18, marginBottom: 8 }}>
              {results.length} result{results.length !== 1 ? 's' : ''}
            </Text>
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
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderBottomWidth: 0.5, borderBottomColor: 'rgba(201,164,74,0.22)', backgroundColor: COLORS.cream },
  back: { padding: 4 },
  bar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.softCream, borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 10, gap: 8, borderWidth: 0.5, borderColor: COLORS.border, ...SHADOW.sm },
  input: { flex: 1, fontFamily: FONTS.body, fontSize: 14, color: COLORS.deepBrown },
  trendLabel: { fontFamily: FONTS.heading, fontSize: 9, letterSpacing: 2, color: COLORS.lightGray, marginBottom: 12 },
  trendWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: RADIUS.full, borderWidth: 0.5, borderColor: COLORS.border, backgroundColor: COLORS.offWhite },
  chipText: { fontFamily: FONTS.heading, fontSize: 9, letterSpacing: 1, color: COLORS.darkGray },
});
