import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { Header, SectionHeader } from '../components/UI';
import { useUser } from '../context/UserContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';

export default function PreferencesScreen({ navigation }) {
  const { user, updatePreferences } = useUser();
  const { preferences } = user;

  const toggleSwitch = (key) => {
    updatePreferences({ [key]: !preferences[key] });
  };

  const PreferenceRow = ({ title, description, value, onToggle }) => (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <Switch
        trackColor={{ false: COLORS.lightGray, true: COLORS.honeyGold }}
        thumbColor={COLORS.offWhite}
        ios_backgroundColor={COLORS.lightGray}
        onValueChange={onToggle}
        value={value}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <Header navigation={navigation} title="Preferences" showBack />
      
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <SectionHeader title="Notifications" />
          <PreferenceRow 
            title="Push Notifications"
            description="Receive alerts for flash sales, order updates, and exclusive drops."
            value={preferences.notifications}
            onToggle={() => toggleSwitch('notifications')}
          />
          <View style={styles.divider} />
          <PreferenceRow 
            title="Email Updates"
            description="Get our newsletter and personalized skincare tips in your inbox."
            value={preferences.emailUpdates}
            onToggle={() => toggleSwitch('emailUpdates')}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOW.sm,
    borderWidth: 1,
    borderColor: 'rgba(201, 164, 74, 0.1)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
  },
  rowText: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  rowTitle: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.deepBrown,
    marginBottom: 4,
  },
  rowDescription: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.warmGray,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
});
