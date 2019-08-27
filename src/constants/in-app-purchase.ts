import { Platform } from 'react-native';

export const SUBSCRIPTION_PRODUCT_ID_FREE = Platform.select({
  ios: 'free',
  android: 'free'
});

export const SUBSCRIPTION_PRODUCT_ID_PREMIUM = Platform.select({
  ios: 'com.aardwegmedia.playpost.premium',
  android: 'com.aardwegmedia.playpost.premium'
});

export const SUBSCRIPTION_PRODUCT_ID_PLUS = Platform.select({
  ios: 'com.aardwegmedia.playpost.subscription.plus',
  android: 'com.aardwegmedia.playpost.subscription.plus'
});

export const SUBSCRIPTION_PRODUCT_IDS = [SUBSCRIPTION_PRODUCT_ID_PREMIUM, SUBSCRIPTION_PRODUCT_ID_PLUS]
