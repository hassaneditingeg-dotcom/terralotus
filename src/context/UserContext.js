import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    id: 'guest',
    name: 'Guest User',
    email: null,
    isLoggedIn: false,
    loyaltyPoints: 0,
    membershipTier: 'Bronze', // Bronze, Silver, Gold, Platinum
    joinDate: null,
    preferences: {
      notifications: true,
      emailUpdates: true,
      favoriteScents: [],
      skinType: null,
    },
    recentlyViewed: [],
    savedAddresses: [],
    orderHistory: [],
  });

  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Setup notifications on mount
  useEffect(() => {
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#C9A44A',
        });
      }
    } catch (e) {
      // Simulator doesn't support push notifications — safe to ignore
      console.log('Notifications setup skipped:', e.message);
    }
  };

  const sendWelcomeNotification = async () => {
    if (user.preferences.notifications) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Welcome to Terra Lotus! 🌿',
          body: 'Thank you for joining our community. Enjoy 10% off your first order!',
          data: { type: 'welcome' },
        },
        trigger: null, // Show immediately
      });
    }
  };

  const sendLoyaltyNotification = async (newTier) => {
    if (user.preferences.notifications) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Congratulations! 🎉`,
          body: `You've reached ${newTier} tier! Enjoy your new benefits.`,
          data: { type: 'loyalty_upgrade', tier: newTier },
        },
        trigger: null,
      });
    }
  };

  const sendSaleNotification = async () => {
    if (user.preferences.notifications) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Flash Sale! 🔥',
          body: 'Limited time: 20% off all products. Don\'t miss out!',
          data: { type: 'sale' },
        },
        trigger: null,
      });
    }
  };

  // Loyalty tiers and benefits
  const LOYALTY_TIERS = {
    Bronze: { minPoints: 0, discount: 0, benefits: ['Standard shipping', 'Basic support'] },
    Silver: { minPoints: 500, discount: 0.05, benefits: ['Free shipping', 'Priority support', 'Early access'] },
    Gold: { minPoints: 1500, discount: 0.10, benefits: ['Free shipping', 'VIP support', 'Exclusive products', 'Birthday gift'] },
    Platinum: { minPoints: 3000, discount: 0.15, benefits: ['Free shipping', 'Concierge support', 'Exclusive products', 'Birthday gift', 'Free samples'] },
  };

  const login = (userData) => {
    setUser({
      ...userData,
      isLoggedIn: true,
    });
  };

  const logout = () => {
    setUser({
      id: 'guest',
      name: 'Guest User',
      email: null,
      isLoggedIn: false,
      loyaltyPoints: 0,
      membershipTier: 'Bronze',
      joinDate: null,
      preferences: {
        notifications: true,
        emailUpdates: true,
        favoriteScents: [],
        skinType: null,
      },
      recentlyViewed: [],
      savedAddresses: [],
      orderHistory: [],
    });
  };

  const addLoyaltyPoints = (points) => {
    const newPoints = user.loyaltyPoints + points;
    const newTier = Object.keys(LOYALTY_TIERS).reverse().find(
      tier => newPoints >= LOYALTY_TIERS[tier].minPoints
    ) || 'Bronze';

    const tierUpgraded = newTier !== user.membershipTier;

    setUser(prev => ({
      ...prev,
      loyaltyPoints: newPoints,
      membershipTier: newTier,
    }));

    // Send notification for tier upgrade
    if (tierUpgraded) {
      sendLoyaltyNotification(newTier);
    }
  };

  const updatePreferences = (preferences) => {
    setUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...preferences },
    }));
  };

  const addToRecentlyViewed = (productId) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 10); // Keep last 10
    });
  };

  const getLoyaltyDiscount = () => {
    return LOYALTY_TIERS[user.membershipTier]?.discount || 0;
  };

  const getTierProgress = () => {
    const currentTier = LOYALTY_TIERS[user.membershipTier];
    const nextTierName = Object.keys(LOYALTY_TIERS).find(
      tier => LOYALTY_TIERS[tier].minPoints > user.loyaltyPoints
    );

    if (!nextTierName) return { progress: 100, nextTier: null, pointsNeeded: 0 };

    const nextTier = LOYALTY_TIERS[nextTierName];
    const pointsInCurrentTier = user.loyaltyPoints - currentTier.minPoints;
    const pointsToNextTier = nextTier.minPoints - currentTier.minPoints;
    const progress = (pointsInCurrentTier / pointsToNextTier) * 100;

    return {
      progress: Math.min(progress, 100),
      nextTier: nextTierName,
      pointsNeeded: nextTier.minPoints - user.loyaltyPoints,
    };
  };

  return (
    <UserContext.Provider value={{
      user,
      recentlyViewed,
      login,
      logout,
      addLoyaltyPoints,
      updatePreferences,
      addToRecentlyViewed,
      getLoyaltyDiscount,
      getTierProgress,
      LOYALTY_TIERS,
      sendWelcomeNotification,
      sendSaleNotification,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);