import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, Animated
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { getProductImageSource } from '../data/products';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';
import Logo from './Logo';


// ── Top Header (Logo + Search + Cart) ──────────────────────────────────────
export function Header({ navigation, showBack = false, title = null }) {
  const insets = useSafeAreaInsets();
  const { totalItems } = useCart();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8, height: insets.top + 60, alignItems: 'center' }]}>
      {/* Left: back or search */}
      <TouchableOpacity
        style={[styles.headerBtn, { justifyContent: 'center' }]}
        onPress={() => showBack ? navigation.goBack() : navigation.navigate('Search')}
      >
        <Text style={styles.headerIcon}>{showBack ? '←' : '🔍'}</Text>
      </TouchableOpacity>

      {/* Center: logo or title */}
      {title ? (
        <Text style={styles.headerTitle}>{title}</Text>
      ) : (
        <View style={styles.logoWrap}>
          <Logo size={46} />
        </View>
      )}

      {/* Right: cart with badge */}
      <TouchableOpacity
        style={styles.headerBtn}
        onPress={() => navigation.navigate('Cart')}
      >
        <Text style={styles.headerIcon}>🛒</Text>
        {totalItems > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalItems}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ── Skeleton Loader ─────────────────────────────────────────────────────────
export function Skeleton({ style }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return <Animated.View style={[style, { backgroundColor: '#EDE6D9', opacity }]} />;
}

// ── Star Rating ──────────────────────────────────────────────────────────────
export function StarRating({ rating, size = 12 }) {
  if (!rating) return null;
  const full = Math.round(rating);
  return (
    <Text style={{ fontSize: size, color: COLORS.honeyGold, letterSpacing: 1 }}>
      {'★'.repeat(full)}{'☆'.repeat(5 - full)}
    </Text>
  );
}

// ── Product Card ─────────────────────────────────────────────────────────────
export function ProductCard({ product, onPress, wide = false }) {
  const imgSrc = getProductImageSource(product);
  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = isOnSale ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <TouchableOpacity
      style={[styles.card, wide && styles.cardWide]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.cardImgWrap}>
        {product.isBestseller && (
          <View style={styles.bsTag}><Text style={styles.bsTagText}>BESTSELLER</Text></View>
        )}
        {product.isLimitedEdition && (
          <View style={[styles.bsTag, { backgroundColor: COLORS.green }]}><Text style={styles.bsTagText}>LIMITED</Text></View>
        )}
        {product.isNew && (
          <View style={[styles.bsTag, { backgroundColor: COLORS.darkGold }]}><Text style={styles.bsTagText}>NEW</Text></View>
        )}
        {isOnSale && (
          <View style={styles.saleTag}><Text style={styles.saleTagText}>-{discountPercent}%</Text></View>
        )}
        {product.isComingSoon && (
          <View style={styles.csTag}><Text style={styles.csTagText}>COMING SOON</Text></View>
        )}
        {product.stockStatus === 'out_of_stock' && (
          <View style={styles.oosOverlay}>
            <Text style={styles.oosText}>OUT OF STOCK</Text>
          </View>
        )}
        {imgSrc ? (
          <View style={styles.cardImg}>
            <Skeleton style={StyleSheet.absoluteFill} />
            <Image
              source={imgSrc}
              style={[styles.cardImg, product.imageScale ? { transform: [{ scale: product.imageScale }] } : null]}
              contentFit="cover"
              transition={200}
            />
          </View>
        ) : (
          <View style={[styles.cardImg, styles.cardImgPlaceholder]}>
            <Text style={{ fontSize: 40 }}>🌿</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={2}>{product.short}</Text>
        {product.rating ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <StarRating rating={product.rating} />
            <Text style={styles.cardReviewCount}>({product.reviewCount})</Text>
          </View>
        ) : (
          <Text style={styles.cardNoReviews}>No reviews yet</Text>
        )}
        <View style={styles.priceRow}>
          {isOnSale ? (
            <>
              <Text style={styles.cardPriceSale}>${product.price.toFixed(2)}</Text>
              <Text style={styles.cardPriceOriginal}>${product.originalPrice.toFixed(2)}</Text>
            </>
          ) : (
            <Text style={styles.cardPrice}>${product.price.toFixed(2)}</Text>
          )}
        </View>
        {product.tags?.includes('sale') && (
          <Text style={styles.cardTag}>Limited Time Offer</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ── Gold Button ──────────────────────────────────────────────────────────────
export function GoldButton({ title, onPress, disabled = false, style }) {
  return (
    <TouchableOpacity
      style={[styles.goldBtn, disabled && styles.goldBtnDisabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text style={styles.goldBtnText}>{title}</Text>
    </TouchableOpacity>
  );
}

// ── Ghost Button ─────────────────────────────────────────────────────────────
export function GhostButton({ title, onPress, style }) {
  return (
    <TouchableOpacity
      style={[styles.ghostBtn, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.ghostBtnText}>{title}</Text>
    </TouchableOpacity>
  );
}

// ── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ eyebrow, title, rightContent }) {
  return (
    <View style={[styles.sectionHeader, rightContent && { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }]}>
      <View style={{ flex: 1 }}>
        {eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
        {title && <Text style={styles.sectionTitle}>{title}</Text>}
      </View>
      {rightContent && <View style={{ flexDirection: 'row', gap: 12, marginBottom: 4 }}>{rightContent}</View>}
    </View>
  );
}

// ── Divider ──────────────────────────────────────────────────────────────────
export function Divider() {
  return <View style={styles.divider} />;
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Header
  header: {
    backgroundColor: COLORS.cream,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  headerBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: { fontSize: 18 },
  logoWrap: { height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    fontFamily: FONTS.heading,
    fontSize: 13,
    letterSpacing: 2,
    color: COLORS.deepBrown,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: COLORS.honeyGold,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontFamily: FONTS.heading,
    fontSize: 8,
    color: COLORS.deepBrown,
  },

  // Card
  card: {
    width: 158,
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  cardWide: { width: '100%' },
  cardImgWrap: { position: 'relative' },
  cardImg: { width: '100%', aspectRatio: 1, backgroundColor: '#EDE6D9' },
  cardImgPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: 11, paddingBottom: 13 },
  cardName: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    color: COLORS.deepBrown,
    lineHeight: 18,
    marginBottom: 4,
  },
  cardReviewCount: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.lightGray,
    marginLeft: 3,
  },
  cardNoReviews: {
    fontFamily: FONTS.bodyItalic,
    fontSize: 10,
    color: COLORS.lightGray,
    marginTop: 2,
  },
  cardPrice: {
    fontFamily: FONTS.heading,
    fontSize: 12,
    color: COLORS.darkGold,
    marginTop: 5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 6,
  },
  cardPriceSale: {
    fontFamily: FONTS.heading,
    fontSize: 12,
    color: COLORS.green,
    fontWeight: '600',
  },
  cardPriceOriginal: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.lightGray,
    textDecorationLine: 'line-through',
  },
  cardTag: {
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.honeyGold,
    marginTop: 2,
  },
  saleTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    backgroundColor: COLORS.green,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  saleTagText: {
    fontFamily: FONTS.heading,
    fontSize: 8,
    letterSpacing: 1,
    color: COLORS.cream,
  },
  oosOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  oosText: {
    fontFamily: FONTS.heading,
    fontSize: 12,
    color: COLORS.cream,
    textAlign: 'center',
  },
  bsTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 2,
    backgroundColor: COLORS.honeyGold,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  bsTagText: {
    fontFamily: FONTS.heading,
    fontSize: 5,
    letterSpacing: 0.5,
    color: COLORS.deepBrown,
  },
  csTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 2,
    backgroundColor: COLORS.darkGray,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  csTagText: {
    fontFamily: FONTS.heading,
    fontSize: 7,
    letterSpacing: 1,
    color: '#F5F0E8',
  },

  // Buttons
  goldBtn: {
    backgroundColor: COLORS.honeyGold,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldBtnDisabled: { opacity: 0.5 },
  goldBtnText: {
    fontFamily: FONTS.heading,
    fontSize: 11,
    letterSpacing: 2,
    color: COLORS.deepBrown,
  },
  ghostBtn: {
    backgroundColor: 'transparent',
    borderRadius: RADIUS.md,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.honeyGold,
  },
  ghostBtnText: {
    fontFamily: FONTS.heading,
    fontSize: 11,
    letterSpacing: 2,
    color: COLORS.darkGold,
  },

  // Section
  sectionHeader: { marginBottom: 14 },
  eyebrow: {
    fontFamily: FONTS.heading,
    fontSize: 9,
    letterSpacing: 3,
    color: COLORS.honeyGold,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  sectionTitle: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: COLORS.deepBrown,
    lineHeight: 26,
  },

  // Divider
  divider: {
    height: 0.5,
    backgroundColor: COLORS.border,
    marginHorizontal: 18,
  },
});
