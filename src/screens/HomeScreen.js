import React from 'react';
import {
  ScrollView, View, Text, TouchableOpacity, StyleSheet, FlatList, Linking
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header, ProductCard, GoldButton, GhostButton, SectionHeader, Divider, StarRating } from '../components/UI';
import { getBestsellers, CATEGORIES } from '../data/products';
import { COLORS, FONTS, SPACING } from '../theme';

// Local collection hero image
const COLLECTION_IMG = require('../../assets/Collection Main image.webp');

const STATS = [
  { value: '1M+', label: 'Customers' },
  { value: '4.85', label: 'Avg Rating' },
  { value: '100%', label: 'Natural' },
  { value: '30-Day', label: 'Guarantee' },
];

const COMPARISONS = [
  ['100% Natural', '✓', '✗'],
  ['Grass-Fed Tallow', '✓', '✗'],
  ['Made In USA', '✓', '✗'],
  ['Third Party Tested', '✓', '✗'],
  ['4 Simple Ingredients', '✓', '✗'],
  ['All Skin Types', '✓', '✗'],
];

const REVIEWS = [
  { name: 'Annie K.', text: 'Love it! I use it on my face, arms, and back every day. Really helped with my wrinkles too.' },
  { name: 'Angie, 39 ✅ Verified', text: 'Makes my skin feel amazing every single day. Highly moisturizing, great for under makeup.' },
  { name: 'Arnie, 45 ✅ Verified', text: 'The Terra Lotus Lavender Balm feels like a natural miracle in a jar. Clean beauty at its finest.' },
];

const PHILOSOPHY = [
  { icon: '🌿', title: 'Nourishing Tallow Balm', body: 'Deep, lasting moisture that nourishes all skin types.' },
  { icon: '🫒', title: 'Italian Olive Oil', body: 'Smooths and helps fade fine lines for a natural, healthy glow.' },
  { icon: '🍯', title: 'Beeswax & Raw Honey', body: 'Protects and heals while locking in gentle, lasting hydration.' },
];

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const bestsellers = getBestsellers();
  const shopCategories = CATEGORIES.filter(c => c !== 'All');

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <Header navigation={navigation} />

      {/* Our Shops Bar */}
      <View style={styles.categoriesWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {shopCategories.map(cat => (
            <TouchableOpacity key={cat} style={styles.catPill} onPress={() => navigation.navigate('Shop', { initialCategory: cat })}>
              <Text style={styles.catText}>{cat.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Collection Hero */}
        <Image
          source={COLLECTION_IMG}
          style={styles.heroImg}
          contentFit="contain"
          transition={200}
        />
        <View style={styles.heroDark}>
          <Text style={styles.heroEyebrow}>THE TERRA LOTUS COLLECTION</Text>
          <Text style={styles.heroSub}>
            Natural wellness products based on simple, 100% natural formulations. Made in the USA.
          </Text>
          <GoldButton title="SHOP THE COLLECTION" onPress={() => navigation.navigate('Shop')} />
        </View>

        {/* Sale bar */}
        <View style={styles.saleBar}>
          <Text style={styles.saleText}>☀️  SPRING SALE — CLAIM 10% OFF</Text>
        </View>


        {/* Skin Quiz Banner */}
        <View style={styles.quizBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.quizEyebrow}>PERSONALIZED RITUAL</Text>
            <Text style={styles.quizTitle}>Find Your Perfect Routine</Text>
            <Text style={styles.quizSub}>4 quick questions. Instant recommendations.</Text>
          </View>
          <TouchableOpacity
            style={styles.quizBtn}
            onPress={() => navigation.navigate('Quiz')}
          >
            <Text style={styles.quizBtnText}>TAKE QUIZ →</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {STATS.map(s => (
            <View key={s.label} style={styles.stat}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <SectionHeader
            eyebrow="Our Collection"
            title="Featured Products"
            rightContent={
              <View style={{ flexDirection: 'row', gap: 15 }}>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.amazon.com/stores/TerraLotus/page/C3414137-059E-46C6-B161-00AB64230F11?lp_asin=B0FFW9SQRW&ref_=ast_bln&store_ref=bl_ast_dp_brandlogo_sto')} activeOpacity={0.7}>
                  <FontAwesome5 name="amazon" size={24} color={COLORS.deepBrown} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.tiktok.com/@terralotus')} activeOpacity={0.7}>
                  <FontAwesome5 name="tiktok" size={24} color={COLORS.deepBrown} />
                </TouchableOpacity>
              </View>
            }
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -18 }} contentContainerStyle={{ paddingHorizontal: 18, gap: 10 }}>
            {bestsellers.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onPress={() => navigation.navigate('ProductDetail', { productId: p.id })}
              />
            ))}
          </ScrollView>
          <View style={{ height: 14 }} />
          <GhostButton title="VIEW ALL PRODUCTS" onPress={() => navigation.navigate('Shop')} />
        </View>

        <Divider />

        {/* Philosophy */}
        <View style={styles.section}>
          <SectionHeader eyebrow="Our Philosophy" title="The Routine Your Skin is Craving" />
          {PHILOSOPHY.map(item => (
            <View key={item.title} style={styles.philRow}>
              <Text style={styles.philIcon}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.philTitle}>{item.title}</Text>
                <Text style={styles.philBody}>{item.body}</Text>
              </View>
            </View>
          ))}
        </View>

        <Divider />

        {/* Us vs Them */}
        <View style={styles.section}>
          <SectionHeader eyebrow="Us vs Them" title="How Are We Different?" />
          <View style={styles.cmpTable}>
            <View style={[styles.cmpRow, styles.cmpHeader]}>
              <Text style={[styles.cmpCell, { flex: 2, color: COLORS.honeyGold }]}></Text>
              <Text style={[styles.cmpCell, styles.cmpColHeader]}>Terra Lotus</Text>
              <Text style={[styles.cmpCell, styles.cmpColHeader]}>Others</Text>
            </View>
            {COMPARISONS.map(([feat, us, them], i) => (
              <View key={feat} style={[styles.cmpRow, i % 2 === 0 ? { backgroundColor: COLORS.offWhite } : { backgroundColor: COLORS.softCream }]}>
                <Text style={[styles.cmpCell, { flex: 2, fontFamily: FONTS.body, fontSize: 12, color: COLORS.deepBrown }]}>{feat}</Text>
                <Text style={[styles.cmpCell, { color: COLORS.green, fontSize: 15, textAlign: 'center' }]}>{us}</Text>
                <Text style={[styles.cmpCell, { color: COLORS.lightGray, fontSize: 15, textAlign: 'center' }]}>{them}</Text>
              </View>
            ))}
          </View>
        </View>

        <Divider />

        {/* Reviews */}
        <View style={styles.section}>
          <SectionHeader eyebrow="Real Reviews" title="1,000,000+ Happy Customers" />
          {REVIEWS.map(r => (
            <View key={r.name} style={styles.revCard}>
              <View style={{ marginBottom: 4 }}>
                <StarRating rating={5} size={12} />
              </View>
              <Text style={styles.revName}>{r.name}</Text>
              <Text style={styles.revText}>"{r.text}"</Text>
            </View>
          ))}
        </View>

        {/* Guarantee */}
        <View style={[styles.guarantee, { paddingBottom: 40, marginBottom: 40 }]}>
          <Text style={{ fontSize: 32 }}>🛡️</Text>
          <Text style={styles.guarTitle}>Try It Risk-Free for 30 Days</Text>
          <Text style={styles.guarBody}>
            We're so confident our tallow balm will transform your skin — 30 days to test it. Full refund if it doesn't deliver.
          </Text>
          <GoldButton title="SHOP NOW IT'S RISK FREE" onPress={() => navigation.navigate('Shop')} style={{ width: '100%', marginTop: 8 }} />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesWrap: { backgroundColor: COLORS.offWhite, borderBottomWidth: 0.5, borderBottomColor: COLORS.border, paddingVertical: 12 },
  catScroll: { paddingHorizontal: 16, gap: 10 },
  catPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(201,164,74,0.3)', backgroundColor: COLORS.cream },
  catText: { fontFamily: FONTS.heading, fontSize: 9, letterSpacing: 1.5, color: COLORS.deepBrown },
  heroImg: { width: '100%', aspectRatio: 1456 / 812 },
  heroDark: { backgroundColor: COLORS.deepBrown, padding: 20, paddingTop: 18 },
  heroEyebrow: { fontFamily: FONTS.heading, fontSize: 10, letterSpacing: 3, color: COLORS.honeyGold, marginBottom: 6 },
  heroSub: { fontFamily: FONTS.bodyItalic, fontSize: 13, color: '#DEC07A', lineHeight: 20, marginBottom: 16 },
  saleBar: { backgroundColor: COLORS.deepBrown, alignItems: 'center', paddingVertical: 9 },
  saleText: { fontFamily: FONTS.heading, fontSize: 9, letterSpacing: 2, color: COLORS.honeyGold },
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.softCream, borderBottomWidth: 0.5, borderBottomColor: 'rgba(201,164,74,0.2)' },
  stat: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  statValue: { fontFamily: FONTS.headingBold, fontSize: 14, color: COLORS.darkGold },
  statLabel: { fontFamily: FONTS.body, fontSize: 9, color: COLORS.lightGray, marginTop: 2 },
  section: { padding: 18, paddingVertical: 20 },
  philRow: { flexDirection: 'row', gap: 12, marginBottom: 14, alignItems: 'flex-start' },
  philIcon: { fontSize: 20, marginTop: 1 },
  philTitle: { fontFamily: FONTS.bodyMedium, fontSize: 13, color: COLORS.deepBrown, marginBottom: 3 },
  philBody: { fontFamily: FONTS.bodyItalic, fontSize: 12, color: COLORS.warmGray, lineHeight: 18 },
  cmpTable: { borderWidth: 0.5, borderColor: 'rgba(201,164,74,0.33)', borderRadius: 10, overflow: 'hidden', marginTop: 12 },
  cmpHeader: { backgroundColor: COLORS.deepBrown },
  cmpRow: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center' },
  cmpCell: { flex: 1, fontFamily: FONTS.heading, fontSize: 9, letterSpacing: 1 },
  cmpColHeader: { color: COLORS.honeyGold, textAlign: 'center' },
  revCard: { backgroundColor: COLORS.offWhite, borderWidth: 0.5, borderColor: 'rgba(201,164,74,0.2)', borderRadius: 10, padding: 13, marginBottom: 9 },
  revName: { fontFamily: FONTS.bodyMedium, fontSize: 13, color: COLORS.deepBrown, marginBottom: 3, marginTop: 3 },
  revText: { fontFamily: FONTS.bodyItalic, fontSize: 12, color: COLORS.warmGray, lineHeight: 18 },
  guarantee: { backgroundColor: COLORS.deepBrown, padding: 24, alignItems: 'center' },
  guarTitle: { fontFamily: FONTS.heading, fontSize: 15, color: COLORS.honeyGold, marginTop: 8, marginBottom: 10 },
  guarBody: { fontFamily: FONTS.bodyItalic, fontSize: 12, color: '#DEC07A', lineHeight: 19, marginBottom: 16, textAlign: 'center' },

  quizBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    margin: 14,
    marginTop: 0,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#F0EBE0',
    borderWidth: 0.5,
    borderColor: 'rgba(201,164,74,0.3)',
  },
  quizEyebrow: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 8,
    letterSpacing: 2,
    color: '#C9A44A',
    marginBottom: 4,
  },
  quizTitle: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 13,
    color: '#3B3225',
    marginBottom: 3,
  },
  quizSub: {
    fontFamily: 'EBGaramond_400Regular_Italic',
    fontSize: 11,
    color: '#7B7466',
  },
  quizBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#3B3225',
    flexShrink: 0,
  },
  quizBtnText: {
    fontFamily: 'Cinzel_400Regular',
    fontSize: 8,
    letterSpacing: 1.5,
    color: '#C9A44A',
  },
});
