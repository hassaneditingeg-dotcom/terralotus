import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Header, GoldButton } from '../components/UI';
import { useUser } from '../context/UserContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';

export default function OrderHistoryScreen({ navigation }) {
  const { user } = useUser();
  const { orderHistory } = user;

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Order {item.id}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.orderItems}>{item.items} {item.items === 1 ? 'item' : 'items'}</Text>
        <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
      </View>
      
      <TouchableOpacity style={styles.detailsBtn}>
        <Text style={styles.detailsBtnText}>View Details</Text>
        <Feather name="chevron-right" size={14} color={COLORS.honeyGold} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <Header navigation={navigation} title="Order History" showBack />
      
      {orderHistory && orderHistory.length > 0 ? (
        <FlatList
          data={orderHistory}
          keyExtractor={item => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Feather name="package" size={60} color={COLORS.lightGray} style={{ marginBottom: SPACING.lg }} />
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptyText}>You haven't placed any orders yet. Discover our collection of natural skincare products!</Text>
          <GoldButton 
            title="Start Shopping" 
            onPress={() => navigation.navigate('Shop')}
            style={styles.shopBtn}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: SPACING.lg,
  },
  orderCard: {
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOW.sm,
    borderWidth: 1,
    borderColor: 'rgba(201, 164, 74, 0.1)',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  orderId: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.deepBrown,
    marginBottom: 4,
  },
  orderDate: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.warmGray,
  },
  statusBadge: {
    backgroundColor: 'rgba(74, 124, 89, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  statusText: {
    fontFamily: FONTS.heading,
    fontSize: 10,
    color: COLORS.green,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  orderItems: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.warmGray,
  },
  orderTotal: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.deepBrown,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBtnText: {
    fontFamily: FONTS.heading,
    fontSize: 12,
    color: COLORS.honeyGold,
    marginRight: 4,
    letterSpacing: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontFamily: FONTS.heading,
    fontSize: 24,
    color: COLORS.deepBrown,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.warmGray,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  shopBtn: {
    width: '100%',
  },
});
