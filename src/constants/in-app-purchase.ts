import { Platform } from 'react-native';

export const SUBSCRIPTION_FREE_SKU = Platform.select({
  ios: 'free',
  android: 'free'
});

export const SUBSCRIPTION_PREMIUM_SKU = Platform.select({
  ios: 'com.aardwegmedia.playpost.premium',
  android: 'com.aardwegmedia.playpost.premium'
});

export const SUBSCRIPTION_PLUS_SKU = Platform.select({
  ios: 'com.aardwegmedia.playpost.subscription.plus',
  android: 'com.aardwegmedia.playpost.subscription.plus'
});

export const SUBSCRIPTION_PRODUCT_IDS = Platform.select({
  // We keep the productId's the same between Apple and Google
  ios: ['com.aardwegmedia.playpost.premium', 'com.aardwegmedia.playpost.subscription.plus'],
  android: ['com.aardwegmedia.playpost.premium', 'com.aardwegmedia.playpost.subscription.plus']
});
