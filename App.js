import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Cinzel_400Regular, Cinzel_600SemiBold } from '@expo-google-fonts/cinzel';
import { EBGaramond_400Regular, EBGaramond_500Medium, EBGaramond_400Regular_Italic } from '@expo-google-fonts/eb-garamond';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from './src/context/CartContext';
import { WishlistProvider } from './src/context/WishlistContext';
import { UserProvider } from './src/context/UserContext';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_600SemiBold,
    EBGaramond_400Regular,
    EBGaramond_500Medium,
    EBGaramond_400Regular_Italic,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.cream, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={COLORS.honeyGold} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <UserProvider>
        <CartProvider>
          <WishlistProvider>
            <StatusBar style="dark" backgroundColor={COLORS.cream} />
            <AppNavigator />
          </WishlistProvider>
        </CartProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
