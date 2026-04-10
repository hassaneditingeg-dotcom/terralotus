import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Header, GoldButton, GhostButton, SectionHeader, Divider } from '../components/UI';
import { useUser } from '../context/UserContext';
import { COLORS, FONTS, SPACING, SHADOW, RADIUS } from '../theme';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, logout, getTierProgress, LOYALTY_TIERS } = useUser();
  const tierProgress = getTierProgress();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Bronze': return '#CD7F32';
      case 'Silver': return '#C0C0C0';
      case 'Gold': return '#FFD700';
      case 'Platinum': return '#E5E4E2';
      default: return COLORS.honeyGold;
    }
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'Bronze': return '🥉';
      case 'Silver': return '🥈';
      case 'Gold': return '🥇';
      case 'Platinum': return '💎';
      default: return '👤';
    }
  };

  if (!user.isLoggedIn) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
        <Header navigation={navigation} title="Profile" />
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl }}>
          
          {/* Collection Hero Image */}
          <ExpoImage 
            source={require('../../assets/Collection Main image.webp')} 
            style={styles.heroImage}
            contentFit="cover"
          />

          <View style={styles.creamyCard}>
            <FontAwesome5 name="user-circle" size={80} color={COLORS.lightGray} style={{ marginBottom: SPACING.lg }} />
            <Text style={[styles.title, { marginBottom: SPACING.md }]}>
              Welcome to Terra Lotus
            </Text>
            <Text style={[styles.subtitle, { textAlign: 'center', marginBottom: SPACING.xl }]}>
              Join our loyalty program to earn points, get exclusive discounts, and enjoy premium benefits.
            </Text>
            
            <GoldButton
              title="Sign In / Join Now"
              onPress={() => Alert.alert('Coming Soon', 'Sign in & account creation will be available in a future update.')}
              style={styles.largeButton}
            />
          </View>

          <View style={styles.guestHolder}>
            <GhostButton
              title="Continue as Guest"
              onPress={() => navigation.goBack()}
              style={styles.largeButton}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <Header navigation={navigation} title="Profile" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.userHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.tierBadge}>
                <Text style={styles.tierIcon}>{getTierIcon(user.membershipTier)}</Text>
                <Text style={[styles.tierText, { color: getTierColor(user.membershipTier) }]}>
                  {user.membershipTier} Member
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Loyalty Points */}
        <View style={styles.section}>
          <SectionHeader title="Loyalty Points" />
          <View style={styles.pointsCard}>
            <View style={styles.pointsHeader}>
              <Text style={styles.pointsValue}>{user.loyaltyPoints.toLocaleString()}</Text>
              <Text style={styles.pointsLabel}>Points Earned</Text>
            </View>
            <View style={styles.pointsBenefits}>
              <Text style={styles.benefitsTitle}>Current Benefits:</Text>
              {LOYALTY_TIERS[user.membershipTier].benefits.map((benefit, index) => (
                <Text key={index} style={styles.benefitItem}>• {benefit}</Text>
              ))}
            </View>
          </View>

          {/* Progress to Next Tier */}
          {tierProgress.nextTier && (
            <View style={styles.progressCard}>
              <Text style={styles.progressTitle}>
                {tierProgress.pointsNeeded} points to {tierProgress.nextTier}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${tierProgress.progress}%` }]}
                />
              </View>
              <Text style={styles.progressText}>
                {tierProgress.progress.toFixed(0)}% complete
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <SectionHeader title="Account" />
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionItem} onPress={() => Alert.alert('Order History', 'Coming soon — your orders will appear here.')}>
              <Feather name="package" size={24} color={COLORS.honeyGold} />
              <Text style={styles.actionText}>Order History</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={() => Alert.alert('Addresses', 'Coming soon — manage your saved addresses here.')}>
              <Feather name="map-pin" size={24} color={COLORS.honeyGold} />
              <Text style={styles.actionText}>Addresses</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={() => Alert.alert('Preferences', 'Coming soon — customize your experience here.')}>
              <Feather name="settings" size={24} color={COLORS.honeyGold} />
              <Text style={styles.actionText}>Preferences</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={() => Alert.alert('Help & Support', 'Email us at support@terralotus.shop for assistance.')}>
              <Feather name="help-circle" size={24} color={COLORS.honeyGold} />
              <Text style={styles.actionText}>Help & Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <View style={[styles.section, { marginTop: SPACING.md }]}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={18} color={COLORS.warmGray} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: COLORS.offWhite,
    margin: SPACING.lg,
    borderRadius: SPACING.lg,
    padding: SPACING.lg,
    ...SHADOW.sm,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.honeyGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  avatarText: {
    fontFamily: FONTS.heading,
    fontSize: 24,
    color: COLORS.cream,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: FONTS.heading,
    fontSize: 20,
    color: COLORS.deepBrown,
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.warmGray,
    marginBottom: 8,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tierIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tierText: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  pointsCard: {
    backgroundColor: COLORS.offWhite,
    borderRadius: SPACING.lg,
    padding: SPACING.lg,
    ...SHADOW.sm,
  },
  pointsHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  pointsValue: {
    fontFamily: FONTS.heading,
    fontSize: 32,
    color: COLORS.honeyGold,
    marginBottom: 4,
  },
  pointsLabel: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.warmGray,
  },
  pointsBenefits: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.lg,
  },
  benefitsTitle: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.deepBrown,
    marginBottom: SPACING.sm,
  },
  benefitItem: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.warmGray,
    marginBottom: 4,
  },
  progressCard: {
    backgroundColor: COLORS.offWhite,
    borderRadius: SPACING.lg,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
    ...SHADOW.sm,
  },
  progressTitle: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.deepBrown,
    marginBottom: SPACING.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.honeyGold,
    borderRadius: 4,
  },
  progressText: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.warmGray,
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  actionItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.offWhite,
    borderRadius: SPACING.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOW.sm,
  },
  actionText: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.deepBrown,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.offWhite,
    borderRadius: SPACING.lg,
    padding: SPACING.lg,
    ...SHADOW.sm,
  },
  logoutText: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.warmGray,
    marginLeft: SPACING.sm,
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 24,
    color: COLORS.deepBrown,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.warmGray,
    lineHeight: 24,
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.xl,
  },
  creamyCard: {
    backgroundColor: COLORS.offWhite,
    width: '100%',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOW.md,
    borderWidth: 1,
    borderColor: 'rgba(201, 164, 74, 0.1)',
  },
  guestHolder: {
    width: '100%',
    padding: SPACING.md,
    backgroundColor: 'rgba(250, 247, 242, 0.5)',
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  largeButton: {
    width: '100%',
    paddingVertical: 18, // ~15% larger than default 14
    paddingHorizontal: SPACING.xl,
  },
});