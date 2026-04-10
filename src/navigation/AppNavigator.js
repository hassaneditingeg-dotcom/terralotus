import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import ShopScreen from '../screens/ShopScreen';
import WishlistScreen from '../screens/WishlistScreen';
import CartScreen from '../screens/CartScreen';
import AboutScreen from '../screens/AboutScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import QuizScreen from '../screens/QuizScreen';
import AuthScreen from '../screens/AuthScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import AddressesScreen from '../screens/AddressesScreen';
import PreferencesScreen from '../screens/PreferencesScreen';

import { COLORS, FONTS } from '../theme';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BEE_LOGO = require('../../assets/logo-vivid.png');

function LogoTabIcon({ focused }) {
  return (
    <View style={{
      padding: 6,
      borderRadius: 12,
      backgroundColor: focused ? 'rgba(201,164,74,0.15)' : 'transparent',
    }}>
      <Image
        source={BEE_LOGO}
        style={{ width: 36, height: 36, opacity: focused ? 1 : 0.8 }}
        contentFit="contain"
      />
    </View>
  );
}

function TabIcon({ name, focused }) {
  return (
    <View style={{
      padding: 6,
      borderRadius: 12,
      backgroundColor: focused ? 'rgba(201,164,74,0.15)' : 'transparent',
    }}>
      <Feather
        name={name}
        size={25}
        color={focused ? COLORS.honeyGold : COLORS.lightGray}
      />
    </View>
  );
}

function TabLabel({ label, focused }) {
  return (
    <Text style={{
      fontFamily: FONTS.heading,
      fontSize: 8,
      letterSpacing: 1.5,
      color: focused ? COLORS.honeyGold : COLORS.lightGray,
      marginTop: 2,
    }}>{label}</Text>
  );
}

function TabBadge({ count }) {
  if (!count) return null;
  return (
    <View style={{
      position: 'absolute', top: -3, right: -6,
      backgroundColor: COLORS.honeyGold,
      borderRadius: 10, minWidth: 16, height: 16,
      alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
    }}>
      <Text style={{ fontFamily: FONTS.heading, fontSize: 8, color: COLORS.deepBrown }}>{count}</Text>
    </View>
  );
}

function MainTabs() {
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.cream,
          borderTopWidth: 0.5,
          borderTopColor: 'rgba(201,164,74,0.33)',
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => (
          <View style={{ alignItems: 'center' }}>
            <TabIcon name="home" focused={focused} />
            <TabLabel label="HOME" focused={focused} />
          </View>
        )}}
      />
      <Tab.Screen name="Shop" component={ShopScreen}
        options={{ tabBarIcon: ({ focused }) => (
          <View style={{ alignItems: 'center' }}>
            <TabIcon name="grid" focused={focused} />
            <TabLabel label="SHOP" focused={focused} />
          </View>
        )}}
      />
      <Tab.Screen name="Wishlist" component={WishlistScreen}
        options={{ tabBarIcon: ({ focused }) => (
          <View style={{ alignItems: 'center' }}>
            <View>
              <TabIcon name="heart" focused={focused} />
              <TabBadge count={wishlistCount} />
            </View>
            <TabLabel label="SAVED" focused={focused} />
          </View>
        )}}
      />
      <Tab.Screen name="Cart" component={CartScreen}
        options={{ tabBarIcon: ({ focused }) => (
          <View style={{ alignItems: 'center' }}>
            <View>
              <TabIcon name="shopping-cart" focused={focused} />
              <TabBadge count={totalItems} />
            </View>
            <TabLabel label="CART" focused={focused} />
          </View>
        )}}
      />
      <Tab.Screen name="About" component={AboutScreen}
        options={{ tabBarIcon: ({ focused }) => (
          <View style={{ alignItems: 'center' }}>
            <LogoTabIcon focused={focused} />
            <TabLabel label="ABOUT" focused={focused} />
          </View>
        )}}
      />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => (
          <View style={{ alignItems: 'center' }}>
            <TabIcon name="user" focused={focused} />
            <TabLabel label="PROFILE" focused={focused} />
          </View>
        )}}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="ProfileStack" component={ProfileScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
        <Stack.Screen name="Addresses" component={AddressesScreen} />
        <Stack.Screen name="Preferences" component={PreferencesScreen} />
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
