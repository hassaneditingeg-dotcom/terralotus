import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Request permission and get the Expo Push Token.
 * Call this once on app startup (e.g. in App.js useEffect).
 * Save the returned token to your backend / Klaviyo / Shopify.
 */
export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log('Push notifications only work on physical devices');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Push notification permission denied');
    return null;
  }

  let token = null;
  try {
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } catch (e) {
    // Push tokens unavailable in Simulator — safe to ignore
    console.log('Push token unavailable:', e.message);
    return null;
  }

  // Android channel setup
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('terra-lotus', {
      name: 'Terra Lotus',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#C9A44A',
      sound: 'default',
    });
  }

  return token;
}

/**
 * Schedule a local notification (e.g. cart abandonment reminder).
 * For real push from your backend, use Expo's push API or Klaviyo.
 */
export async function scheduleLocalNotification({ title, body, data = {}, seconds = 3600 }) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data, sound: 'default' },
    trigger: { seconds },
  });
}

/**
 * Cancel all pending local notifications.
 */
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Pre-built notification templates for Terra Lotus.
 * Call these from your marketing flows.
 */
export const NOTIFICATIONS = {
  // Cart abandonment — schedule 1h after user adds to cart but doesn't checkout
  cartAbandonment: () => scheduleLocalNotification({
    title: '🍯 Your cart is waiting',
    body: 'Your Terra Lotus order is saved. Complete your purchase and get free shipping today.',
    seconds: 3600,
  }),

  // Welcome — fire immediately after install
  welcome: () => scheduleLocalNotification({
    title: '✨ Welcome to Terra Lotus',
    body: 'Discover natural skincare trusted by 1,000,000+ customers. Claim your 10% spring discount.',
    seconds: 5,
  }),

  // Sale alert
  springSale: () => scheduleLocalNotification({
    title: '☀️ Spring Sale — 10% Off Everything',
    body: 'Our biggest sale is live. Shop all natural tallow balms, soaps, and more.',
    seconds: 1,
  }),

  // Restock
  restock: (productName) => scheduleLocalNotification({
    title: `${productName} is back in stock!`,
    body: 'It goes fast. Tap to grab yours before it sells out again.',
    seconds: 1,
  }),
};
