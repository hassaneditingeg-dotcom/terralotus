import React, { useState, useRef } from 'react';
import {
  ScrollView, View, Text, TouchableOpacity, StyleSheet, Animated
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Header, GoldButton, GhostButton, StarRating, Divider, Skeleton } from '../components/UI';
import { getProductById, getProductImageUrl, getProductAllImageSources, getScentImageIndex } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';
import Product3DViewer from '../components/Product3DViewer';

// Try to import haptics gracefully — won't crash if package not yet installed
let Haptics = null;
try { Haptics = require('expo-haptics'); } catch (_) {}

const triggerHaptic = (type = 'medium') => {
  if (!Haptics) return;
  if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else if (type === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const product = getProductById(productId);
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const insets = useSafeAreaInsets();

  const [selectedScent, setSelectedScent] = useState(product?.scents?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [subscribed, setSubscribed] = useState(false);
  const [expandedIng, setExpandedIng] = useState(null);
  const [addedToBag, setAddedToBag] = useState(false);
  const [viewMode, setViewMode] = useState('3d'); // '3d' | 'gallery'

  // Ingredient expand animation
  const ingAnims = useRef({}).current;
  const getIngAnim = (i) => {
    if (!ingAnims[i]) ingAnims[i] = new Animated.Value(0);
    return ingAnims[i];
  };

  // Add-to-cart pulse animation
  const cartScale = useRef(new Animated.Value(1)).current;

  if (!product) return null;

  const basePrice = selectedSize === '4oz' && product.price4oz ? product.price4oz : product.price;
  const finalPrice = subscribed ? basePrice * 0.75 : basePrice;
  const wishlisted = isWishlisted(product.id);
  const allImages = getProductAllImageSources(product);
  const currentImageUrl = getProductImageUrl(product, selectedScent, 0);

  const handleAddToCart = () => {
    triggerHaptic('success');
    addToCart({
      id: `${product.id}_${selectedScent}_${selectedSize}`,
      productId: product.id,
      name: product.short,
      scent: selectedScent,
      size: selectedSize,
      price: finalPrice,
      imageUrl: currentImageUrl?.uri || currentImageUrl,
    });
    setAddedToBag(true);
    Animated.sequence([
      Animated.spring(cartScale, { toValue: 1.08, friction: 3, useNativeDriver: true }),
      Animated.spring(cartScale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setAddedToBag(false), 1800);
  };

  const handleWishlist = () => {
    triggerHaptic('light');
    toggle(product.id);
  };

  const toggleIngredient = (i) => {
    const anim = getIngAnim(i);
    const willExpand = expandedIng !== i;
    setExpandedIng(willExpand ? i : null);
    // Collapse previous
    if (expandedIng !== null && expandedIng !== i) {
      Animated.timing(getIngAnim(expandedIng), {
        toValue: 0, duration: 180, useNativeDriver: false,
      }).start();
    }
    Animated.timing(anim, {
      toValue: willExpand ? 1 : 0, duration: 220, useNativeDriver: false,
    }).start();
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <Header navigation={navigation} showBack />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── View mode toggle: 3D / Gallery ── */}
        <View style={styles.viewToggleBar}>
          {['3d', 'gallery'].map(mode => (
            <TouchableOpacity
              key={mode}
              style={[styles.viewToggleBtn, viewMode === mode && styles.viewToggleBtnOn]}
              onPress={() => { triggerHaptic('light'); setViewMode(mode); }}
            >
              <Text style={[styles.viewToggleText, viewMode === mode && styles.viewToggleTextOn]}>
                {mode === '3d' ? '✦ 3D VIEW' : '⊞ GALLERY'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── 3D viewer or classic image gallery ── */}
        {viewMode === '3d' ? (
          <View style={styles.viewerWrap}>
            <Product3DViewer images={allImages} />
          </View>
        ) : (
          <View style={{ position: 'relative' }}>
            <View style={styles.heroImg}>
              <Skeleton style={StyleSheet.absoluteFill} />
              {allImages[0] && (
                <Image
                  source={allImages[0]}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                  transition={300}
                />
              )}
            </View>
          </View>
        )}

        {/* Wishlist button */}
        <TouchableOpacity style={styles.wishBtn} onPress={handleWishlist}>
          <Text style={{ fontSize: 20 }}>{wishlisted ? '❤️' : '♡'}</Text>
        </TouchableOpacity>

        <View style={styles.info}>

          {/* Name & Rating */}
          <Text style={styles.name}>{product.short}</Text>
          {product.rating && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
              <StarRating rating={product.rating} size={13} />
              <Text style={styles.ratingCount}>
                {product.rating} · {(product.reviewCount / 1000).toFixed(0)}k reviews
              </Text>
            </View>
          )}
          <Text style={styles.tagline}>{product.tagline}</Text>

          {/* Highlights */}
          <View style={styles.highlightsWrap}>
            {product.highlights.map(h => (
              <View key={h} style={styles.hlRow}>
                <View style={styles.hlCheck}><Text style={styles.hlCheckText}>✓</Text></View>
                <Text style={styles.hlText}>{h}</Text>
              </View>
            ))}
          </View>

          {/* Subscribe toggle */}
          {product.hasSubscription && (
            <View style={styles.subToggle}>
              <TouchableOpacity
                style={[styles.subOpt, !subscribed && styles.subOptOn]}
                onPress={() => { triggerHaptic('light'); setSubscribed(false); }}
              >
                <Text style={[styles.subOptText, !subscribed && styles.subOptTextOn]}>One-Time</Text>
                <Text style={[styles.subOptPrice, !subscribed && styles.subOptPriceOn]}>
                  ${basePrice.toFixed(2)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.subOpt, subscribed && styles.subOptOn]}
                onPress={() => { triggerHaptic('light'); setSubscribed(true); }}
              >
                <Text style={[styles.subOptText, subscribed && styles.subOptTextOn]}>Subscribe</Text>
                <Text style={[styles.subOptPrice, subscribed && styles.subOptPriceOn]}>
                  ${(basePrice * 0.75).toFixed(2)} · Save 25%
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Scent selector */}
          {product.scents.length > 1 && (
            <>
              <Text style={styles.varLabel}>
                SCENT — <Text style={{ color: COLORS.deepBrown }}>{selectedScent}</Text>
              </Text>
              <View style={styles.varRow}>
                {product.scents.map(s => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.chip, selectedScent === s && styles.chipOn]}
                    onPress={() => {
                      triggerHaptic('light');
                      setSelectedScent(s);
                    }}
                  >
                    <Text style={[styles.chipText, selectedScent === s && styles.chipTextOn]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Size selector */}
          {product.sizes.length > 1 && (
            <>
              <Text style={styles.varLabel}>
                SIZE — <Text style={{ color: COLORS.deepBrown }}>{selectedSize}</Text>
              </Text>
              <View style={styles.varRow}>
                {product.sizes.map(s => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.chip, selectedSize === s && styles.chipOn]}
                    onPress={() => { triggerHaptic('light'); setSelectedSize(s); }}
                  >
                    <Text style={[styles.chipText, selectedSize === s && styles.chipTextOn]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Price */}
          <View style={styles.priceRow}>
            {subscribed && (
              <Text style={styles.strikePrice}>${basePrice.toFixed(2)}</Text>
            )}
            <Text style={styles.price}>${finalPrice.toFixed(2)}</Text>
            {subscribed && (
              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>SAVE 25%</Text>
              </View>
            )}
          </View>

          {/* CTA Buttons */}
          <Animated.View style={{ transform: [{ scale: cartScale }] }}>
            <GoldButton
              title={product.isComingSoon ? 'COMING SOON' : (addedToBag ? '✓ ADDED TO CART' : 'ADD TO CART')}
              disabled={product.isComingSoon}
              onPress={handleAddToCart}
              style={{
                marginBottom: 10,
                backgroundColor: addedToBag ? COLORS.green : COLORS.honeyGold,
              }}
            />
          </Animated.View>
          {!product.isComingSoon && (
            <GhostButton
              title="CHECKOUT NOW"
              onPress={() => { handleAddToCart(); navigation.navigate('Cart'); }}
            />
          )}
        </View>

        <Divider />

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.subhead}>About This Product</Text>
          <Text style={styles.bodyText}>{product.description}</Text>
          <Text style={[styles.subhead, { marginTop: 16 }]}>How To Use</Text>
          <Text style={styles.bodyText}>{product.howToUse}</Text>
        </View>

        <Divider />

        {/* ── Ingredient Spotlight (enhanced animated) ── */}
        <View style={styles.section}>
          <Text style={styles.subhead}>Key Ingredients</Text>
          <Text style={styles.ingIntro}>
            Tap each ingredient to learn why it's in your formula.
          </Text>
          {product.ingredients.map((ing, i) => {
            const anim = getIngAnim(i);
            const height = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 72] });
            const isOpen = expandedIng === i;
            return (
              <View key={ing.name} style={styles.ingCard}>
                <TouchableOpacity
                  style={styles.ingRow}
                  onPress={() => toggleIngredient(i)}
                  activeOpacity={0.7}
                >
                  <View style={styles.ingLeft}>
                    <View style={[styles.ingDot, isOpen && styles.ingDotOpen]} />
                    <Text style={[styles.ingName, isOpen && { color: COLORS.honeyGold }]}>
                      {ing.name}
                    </Text>
                  </View>
                  <Text style={[styles.ingToggle, isOpen && { color: COLORS.honeyGold }]}>
                    {isOpen ? '−' : '+'}
                  </Text>
                </TouchableOpacity>
                <Animated.View style={{ height, overflow: 'hidden' }}>
                  <View style={styles.ingDetail}>
                    <Text style={styles.ingDetailLabel}>WHY IT'S HERE</Text>
                    <Text style={styles.ingDetailText}>{ing.benefit}</Text>
                  </View>
                </Animated.View>
              </View>
            );
          })}
        </View>

        <Divider />

        {/* 30-day guarantee */}
        <View style={styles.guarRow}>
          <Text style={{ fontSize: 24 }}>🛡️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.guarTitle}>30-Day Guarantee</Text>
            <Text style={styles.guarText}>
              If your skin doesn't feel revitalized, every penny back. No questions asked.
            </Text>
          </View>
        </View>

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <>
            <Divider />
            <View style={styles.section}>
              <View style={styles.revHeader}>
                <Text style={styles.subhead}>Customer Reviews</Text>
                <View style={styles.revRatingBadge}>
                  <Text style={styles.revRatingNum}>{product.rating}</Text>
                  <Text style={{ color: COLORS.honeyGold, fontSize: 10 }}>★</Text>
                </View>
              </View>
              {product.reviews.map(r => (
                <View key={r.name} style={styles.revCard}>
                  <Text style={{ color: COLORS.honeyGold, fontSize: 11, letterSpacing: 1 }}>★★★★★</Text>
                  <Text style={styles.revName}>{r.name}</Text>
                  <Text style={styles.revText}>"{r.text}"</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{ height: insets.bottom + 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewToggleBar: {
    flexDirection: 'row',
    marginHorizontal: 18,
    marginTop: 10,
    marginBottom: 4,
    borderRadius: RADIUS.md,
    borderWidth: 0.5,
    borderColor: 'rgba(201,164,74,0.3)',
    overflow: 'hidden',
  },
  viewToggleBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
  },
  viewToggleBtnOn: { backgroundColor: COLORS.deepBrown },
  viewToggleText: {
    fontFamily: FONTS.heading,
    fontSize: 9,
    letterSpacing: 1.5,
    color: COLORS.lightGray,
  },
  viewToggleTextOn: { color: COLORS.honeyGold },
  viewerWrap: {
    backgroundColor: COLORS.softCream,
    marginHorizontal: 18,
    borderRadius: RADIUS.lg,
    marginBottom: 8,
    overflow: 'hidden',
  },
  heroImg: { width: '100%', aspectRatio: 1 },
  wishBtn: {
    alignSelf: 'flex-end',
    marginRight: 18,
    marginTop: -8,
    backgroundColor: COLORS.offWhite,
    borderRadius: 99,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(201,164,74,0.25)',
    ...SHADOW.sm,
  },
  info: { padding: 18, paddingBottom: 12 },
  name: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: COLORS.deepBrown,
    marginBottom: 6,
    lineHeight: 26,
  },
  ratingCount: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.lightGray,
    marginLeft: 6,
  },
  tagline: {
    fontFamily: FONTS.bodyItalic,
    fontSize: 14,
    color: COLORS.warmGray,
    marginBottom: 14,
    lineHeight: 20,
  },
  highlightsWrap: {
    backgroundColor: COLORS.softCream,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 14,
  },
  hlRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  hlCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  hlCheckText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  hlText: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.darkGray,
    lineHeight: 18,
    flex: 1,
  },
  subToggle: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: 'rgba(201,164,74,0.33)',
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginVertical: 14,
  },
  subOpt: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
  },
  subOptOn: { backgroundColor: COLORS.deepBrown },
  subOptText: {
    fontFamily: FONTS.heading,
    fontSize: 8,
    letterSpacing: 1,
    color: COLORS.lightGray,
    marginBottom: 3,
  },
  subOptTextOn: { color: COLORS.honeyGold },
  subOptPrice: { fontFamily: FONTS.body, fontSize: 11, color: COLORS.lightGray },
  subOptPriceOn: { color: COLORS.cream },
  varLabel: {
    fontFamily: FONTS.heading,
    fontSize: 9,
    letterSpacing: 2,
    color: COLORS.lightGray,
    marginTop: 14,
    marginBottom: 9,
  },
  varRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 4 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: RADIUS.md,
    borderWidth: 0.5,
    borderColor: 'rgba(201,164,74,0.33)',
    backgroundColor: COLORS.offWhite,
  },
  chipOn: { backgroundColor: COLORS.deepBrown, borderColor: COLORS.deepBrown },
  chipText: { fontFamily: FONTS.body, fontSize: 13, color: COLORS.darkGray },
  chipTextOn: { color: COLORS.honeyGold },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginTop: 14,
    marginBottom: 14,
  },
  price: { fontFamily: FONTS.heading, fontSize: 28, color: COLORS.deepBrown },
  strikePrice: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: '#B0A090',
    textDecorationLine: 'line-through',
  },
  saveBadge: {
    backgroundColor: COLORS.green,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  saveBadgeText: {
    fontFamily: FONTS.heading,
    fontSize: 8,
    letterSpacing: 1,
    color: COLORS.cream,
  },
  section: { padding: 18, paddingVertical: 16 },
  subhead: {
    fontFamily: FONTS.heading,
    fontSize: 13,
    color: COLORS.deepBrown,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  bodyText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.warmGray,
    lineHeight: 22,
  },
  ingIntro: {
    fontFamily: FONTS.bodyItalic,
    fontSize: 12,
    color: COLORS.lightGray,
    marginBottom: 10,
  },
  ingCard: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(201,164,74,0.15)',
  },
  ingRow: {
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ingLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  ingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(201,164,74,0.4)',
    flexShrink: 0,
  },
  ingDotOpen: { backgroundColor: COLORS.honeyGold },
  ingName: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 14,
    color: COLORS.deepBrown,
    flex: 1,
  },
  ingToggle: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: COLORS.lightGray,
  },
  ingDetail: {
    paddingBottom: 14,
    paddingLeft: 16,
  },
  ingDetailLabel: {
    fontFamily: FONTS.heading,
    fontSize: 8,
    letterSpacing: 2,
    color: COLORS.honeyGold,
    marginBottom: 5,
  },
  ingDetailText: {
    fontFamily: FONTS.bodyItalic,
    fontSize: 13,
    color: COLORS.warmGray,
    lineHeight: 19,
  },
  guarRow: {
    flexDirection: 'row',
    gap: 14,
    padding: 16,
    paddingHorizontal: 18,
    backgroundColor: COLORS.softCream,
    alignItems: 'flex-start',
  },
  guarTitle: {
    fontFamily: FONTS.heading,
    fontSize: 11,
    color: COLORS.deepBrown,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  guarText: {
    fontFamily: FONTS.bodyItalic,
    fontSize: 12,
    color: COLORS.warmGray,
    lineHeight: 18,
  },
  revHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  revRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.softCream,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 0.5,
    borderColor: 'rgba(201,164,74,0.3)',
  },
  revRatingNum: {
    fontFamily: FONTS.headingBold,
    fontSize: 12,
    color: COLORS.deepBrown,
  },
  revCard: {
    backgroundColor: COLORS.offWhite,
    borderWidth: 0.5,
    borderColor: 'rgba(201,164,74,0.2)',
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 10,
    ...SHADOW.sm,
  },
  revName: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.deepBrown,
    marginTop: 4,
    marginBottom: 4,
  },
  revText: {
    fontFamily: FONTS.bodyItalic,
    fontSize: 12,
    color: COLORS.warmGray,
    lineHeight: 18,
  },
});
