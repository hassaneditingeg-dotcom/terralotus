import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header, GoldButton, GhostButton } from '../components/UI';
import { useUser } from '../context/UserContext';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';

export default function AuthScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { login } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = () => {
    // Mocking a successful login with dummy data
    login({
      id: 'usr123',
      name: isLogin ? 'Jane Doe' : (name || 'New User'),
      email: email || 'user@example.com',
      loyaltyPoints: 450,
      membershipTier: 'Bronze',
      joinDate: new Date().toISOString(),
      preferences: {
        notifications: true,
        emailUpdates: true,
        favoriteScents: ['Lavender'],
        skinType: 'Combination',
      },
      recentlyViewed: [],
      savedAddresses: [
        { id: '1', street: '123 Main St', city: 'Los Angeles', state: 'CA', zip: '90001', isDefault: true }
      ],
      orderHistory: [
        { id: 'ORD-892', date: '2025-10-15', total: 64.00, status: 'Delivered', items: 2 }
      ],
    });
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <Header navigation={navigation} title={isLogin ? "Sign In" : "Join Now"} showBack />
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          
          <ExpoImage 
            source={require('../../assets/logo-vivid.png')} 
            style={styles.logo}
            contentFit="contain"
          />
          
          <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Log in to access your loyalty rewards and saved items.' : 'Join Terra Lotus to earn points and exclusive discounts.'}
          </Text>

          <View style={styles.formCard}>
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Jane Doe"
                  placeholderTextColor={COLORS.lightGray}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput 
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={COLORS.lightGray}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput 
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={COLORS.lightGray}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {isLogin && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <GoldButton 
              title={isLogin ? "Sign In" : "Create Account"} 
              onPress={handleSubmit} 
              style={styles.submitBtn}
            />
          </View>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.toggleLink}>{isLogin ? "Join Now" : "Sign In"}</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 28,
    color: COLORS.deepBrown,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.warmGray,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  formCard: {
    width: '100%',
    backgroundColor: COLORS.offWhite,
    padding: SPACING.xl,
    borderRadius: RADIUS.lg,
    ...SHADOW.sm,
    borderWidth: 1,
    borderColor: 'rgba(201, 164, 74, 0.1)',
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontFamily: FONTS.heading,
    fontSize: 12,
    color: COLORS.deepBrown,
    marginBottom: SPACING.xs,
    letterSpacing: 1,
  },
  input: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.deepBrown,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.cream,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
  },
  forgotPasswordText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 14,
    color: COLORS.honeyGold,
  },
  submitBtn: {
    marginTop: SPACING.sm,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  toggleText: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.warmGray,
  },
  toggleLink: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    color: COLORS.honeyGold,
    marginLeft: SPACING.xs,
    textDecorationLine: 'underline',
  },
});
