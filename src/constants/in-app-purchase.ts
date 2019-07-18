import { Platform } from 'react-native';

export const SUBSCRIPTION_PRODUCT_IDS = Platform.select({
  // We keep the productId's the same between Apple and Google
  ios: ['com.aardwegmedia.playpost.premium', 'com.aardwegmedia.playpost.subscription.plus'],
  android: ['com.aardwegmedia.playpost.premium', 'com.aardwegmedia.playpost.subscription.plus']
});
