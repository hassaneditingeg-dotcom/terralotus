import React, { useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Linking, Animated, PanResponder
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header, GoldButton, GhostButton } from '../components/UI';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';

let Haptics = null;
try { Haptics = require('expo-haptics'); } catch (_) {}
const triggerHaptic = () => Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Swipeable cart row — swipe left to reveal delete
function SwipeableCartItem({ item, onRemove, onUpdateQuantity }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const deleteOpacity = translateX.interpolate({ inputRange: [-80, 0], outputRange: [1, 0] });

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dy) < 20,
      onPanResponderMove: (_, g) => {
        const val = Math.max(-80, Math.min(0, g.dx));
        translateX.setValue(val);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx < -40) {
          Animated.spring(translateX, { toValue: -72, friction: 7, useNativeDriver: true }).start();
        } else {
          Animated.spring(translateX, { toValue: 0, friction: 7, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.swipeWrap}>
      {/* Delete backdrop */}
      <Animated.View style={[styles.deleteBg, { opacity: deleteOpacity }]}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => { triggerHaptic(); onRemove(item.id); }}
        >
          <Text style={styles.deleteBtnText}>🗑</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Cart item */}
      <Animated.View
        style={[styles.cartItem, { transform: [{ translateX }] }]}
        {...pan.panHandlers}
      >
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.thumb} contentFit="cover" />
        ) : (
          <View style={[styles.thumb, { backgroundColor: COLORS.softCream, alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ fontSize: 22 }}>🍯</Text>
          </View>
        )}
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          {item.scent && <Text style={styles.itemVariant}>{item.scent} · {item.size}</Text>}
          <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => { triggerHaptic(); onUpdateQuantity(item.id, item.quantity - 1); }}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyNum}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => { triggerHaptic(); onUpdateQuantity(item.id, item.quantity + 1); }}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => { triggerHaptic(); onRemove(item.id); }}>
          <Text style={{ color: COLORS.lightGray, fontSize: 18 }}>×</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// Loyalty tier progress bar shown in cart
function LoyaltyBar({ total }) {
  const TIER_THRESHOLDS = [0, 50, 100, 200];
  const TIER_NAMES = ['Bronze', 'Silver', 'Gold', 'Platinum'];

  const tierIdx = TIER_THRESHOLDS.reduce((acc, t, i) => (total >= t ? i : acc), 0);
  const currentTier = TIER_NAMES[tierIdx];
  const nextTier = TIER_NAMES[Math.min(tierIdx + 1, 3)];
  const nextThreshold = TIER_THRESHOLDS[Math.min(tierIdx + 1, 3)];
  const progress = tierIdx === 3 ? 1 : (total / nextThreshold);
  const remaining = Math.max(0, nextThreshold - total).toFixed(2);

  const TIER_ICONS = { Bronze: '🥉', Silver: '🥈', Gold: '🥇', Platinum: '💎' };

  return (
    <View style={styles.loyaltyWrap}>
      <View style={styles.loyaltyHeader}>
        <Text style={styles.loyaltyIcon}>{TIER_ICONS[currentTier]}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.loyaltyTitle}>{currentTier} Member</Text>
          {tierIdx < 3 && (
            <Text style={styles.loyaltySub}>
              ${remaining} away from {nextTier} {TIER_ICONS[nextTier]}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.loyaltyTrack}>
        <View style={[styles.loyaltyFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
      </View>
    </View>
  );
}

export default function CartScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const { user } = useUser();

  const handleCheckout = () => {
    if (items.length === 0) return;
    Linking.openURL('https://terralotus.shop/cart');
  };

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
        <Header navigation={navigation} />
        <View style={styles.empty}>
          <Text style={{ fontSize: 52, marginBottom: 12 }}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Discover our natural skincare collection</Text>
          <GoldButton
            title="SHOP NOW"
            onPress={() => navigation.navigate('Shop')}
            style={{ width: 180, marginTop: 20 }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <Header navigation={navigation} />
      <FlatList
        data={items}
        keyExtractor={i => i.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.cartHeader}>
              <Text style={styles.cartTitle}>MY CART</Text>
              <Text style={styles.cartCount}>{items.length} ITEM{items.length !== 1 ? 'S' : ''}</Text>
            </View>
            <View style={styles.swipeHint}>
              <Text style={styles.swipeHintText}>← Swipe items to remove</Text>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <SwipeableCartItem
            item={item}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
          />
        )}
        ListFooterComponent={() => (
          <View style={styles.footer}>
            <LoyaltyBar total={total} />

            {/* Free shipping bar */}
            <View style={styles.freeShipWrap}>
              {total >= 60 ? (
                <Text style={styles.freeShipText}>🎉 You've unlocked FREE shipping!</Text>
              ) : (
                <Text style={styles.freeShipText}>
                  Add ${(60 - total).toFixed(2)} more for FREE shipping
                </Text>
              )}
              <View style={styles.freeShipTrack}>
                <View style={[styles.freeShipFill, { width: `${Math.min((total / 60) * 100, 100)}%` }]} />
              </View>
            </View>

            {/* Order summary */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={[styles.summaryValue, { color: total >= 60 ? COLORS.green : COLORS.warmGray }]}>
                  {total >= 60 ? 'FREE' : 'Calculated at checkout'}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* Sticky checkout bar */}
      <View style={[styles.checkoutBar, { paddingBottom: insets.bottom + 8 }]}>
        <GoldButton
          title={`CHECKOUT — $${total.toFixed(2)}`}
          onPress={handleCheckout}
        />
        <GhostButton
          title="CONTINUE SHOPPING"
          onPress={() => navigation.navigate('Shop')}
          style={{ marginTop: 6 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: COLORS.deepBrown,
    marginBottom: 8,
  },
  emptySub: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.lightGray,
    textAlign: 'center',
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: 18,
    paddingBottom: 6,
  },
  cartTitle: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.deepBrown,
    letterSpacing: 1,
  },
  cartCount: {
    fontFamily: FONTS.heading,
    fontSize: 9,
    color: COLORS.warmGray,
    letterSpacing: 1.5,
  },
  swipeHint: {
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  swipeHintText: {
    fontFamily: FONTS.bodyItalic,
    fontSize: 11,
    color: COLORS.lightGray,
  },

  // Swipe-to-delete
  swipeWrap: {
    position: 'relative',
    marginBottom: 1,
  },
  deleteBg: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 72,
    backgroundColor: '#C0392B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: { padding: 12 },
  deleteBtnText: { fontSize: 20 },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    paddingHorizontal: 18,
    backgroundColor: COLORS.cream,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(201,164,74,0.12)',
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    flexShrink: 0,
  },
  itemInfo: { flex: 1 },
  itemName: {
    fontFamily: FONTS.heading,
    fontSize: 11,
    color: COLORS.deepBrown,
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  itemVariant: {
    fontFamily: FONTS.bodyItalic,
    fontSize: 12,
    color: COLORS.warmGray,
    marginBottom: 4,
  },
  itemPrice: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    color: COLORS.deepBrown,
    marginBottom: 8,
  },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 0 },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.sm,
    borderWidth: 0.5,
    borderColor: 'rgba(201,164,74,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.offWhite,
  },
  qtyBtnText: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    color: COLORS.deepBrown,
  },
  qtyNum: {
    fontFamily: FONTS.heading,
    fontSize: 13,
    color: COLORS.deepBrown,
    width: 32,
    textAlign: 'center',
  },

  // Footer
  footer: { padding: 18 },

  // Loyalty bar
  loyaltyWrap: {
    backgroundColor: COLORS.softCream,
    borderRadius: RADIUS.lg,
    padding: 14,
    marginBottom: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(201,164,74,0.2)',
  },
  loyaltyHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  loyaltyIcon: { fontSize: 22 },
  loyaltyTitle: { fontFamily: FONTS.heading, fontSize: 10, color: COLORS.deepBrown, letterSpacing: 1 },
  loyaltySub: { fontFamily: FONTS.body, fontSize: 11, color: COLORS.warmGray, marginTop: 2 },
  loyaltyTrack: {
    height: 4,
    borderRadius: 99,
    backgroundColor: 'rgba(201,164,74,0.15)',
    overflow: 'hidden',
  },
  loyaltyFill: {
    height: '100%',
    backgroundColor: COLORS.honeyGold,
    borderRadius: 99,
  },

  // Free shipping
  freeShipWrap: {
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(201,164,74,0.15)',
  },
  freeShipText: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.warmGray,
    marginBottom: 8,
  },
  freeShipTrack: {
    height: 3,
    borderRadius: 99,
    backgroundColor: 'rgba(201,164,74,0.15)',
    overflow: 'hidden',
  },
  freeShipFill: {
    height: '100%',
    backgroundColor: COLORS.green,
    borderRadius: 99,
  },

  // Summary
  summaryCard: {
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(201,164,74,0.2)',
    ...SHADOW.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: { fontFamily: FONTS.body, fontSize: 13, color: COLORS.warmGray },
  summaryValue: { fontFamily: FONTS.body, fontSize: 13, color: COLORS.deepBrown },
  summaryTotal: {
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(201,164,74,0.2)',
    marginTop: 6,
    paddingTop: 10,
    marginBottom: 0,
  },
  totalLabel: { fontFamily: FONTS.heading, fontSize: 12, color: COLORS.deepBrown, letterSpacing: 0.5 },
  totalValue: { fontFamily: FONTS.heading, fontSize: 16, color: COLORS.deepBrown },

  // Sticky checkout
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: 12,
    backgroundColor: COLORS.cream,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(201,164,74,0.25)',
  },
});
