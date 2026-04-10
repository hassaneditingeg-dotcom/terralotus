import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Header, GhostButton } from '../components/UI';
import { useUser } from '../context/UserContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';

export default function AddressesScreen({ navigation }) {
  const { user } = useUser();
  const { savedAddresses } = user;

  const renderAddressItem = ({ item }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>DEFAULT</Text>
          </View>
        )}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Feather name="edit-2" size={16} color={COLORS.lightGray} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Feather name="trash-2" size={16} color={COLORS.lightGray} />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.addressName}>{user.name}</Text>
      <Text style={styles.addressLine}>{item.street}</Text>
      <Text style={styles.addressLine}>{item.city}, {item.state} {item.zip}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <Header navigation={navigation} title="Saved Addresses" showBack />
      
      <View style={styles.container}>
        <FlatList
          data={savedAddresses}
          keyExtractor={item => item.id}
          renderItem={renderAddressItem}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>You haven't saved any addresses yet.</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: SPACING.xl }}
        />
        
        <GhostButton 
          title="+ Add New Address" 
          onPress={() => {}}
          style={styles.addBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
  addressCard: {
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOW.sm,
    borderWidth: 1,
    borderColor: 'rgba(201, 164, 74, 0.1)',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  defaultBadge: {
    backgroundColor: COLORS.honeyGold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  defaultText: {
    fontFamily: FONTS.heading,
    fontSize: 10,
    color: COLORS.deepBrown,
    letterSpacing: 1,
  },
  actionRow: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  actionBtn: {
    padding: 4,
    marginLeft: SPACING.sm,
  },
  addressName: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.deepBrown,
    marginBottom: 4,
  },
  addressLine: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.warmGray,
    marginBottom: 2,
  },
  emptyState: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.warmGray,
  },
  addBtn: {
    marginTop: 'auto',
  },
});
