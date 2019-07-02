import { Platform } from 'react-native';

export const SUBSCRIPTION_PRODUCT_IDS = Platform.select({
  ios: ['com.aardwegmedia.playpost.premium', 'com.aardwegmedia.playpost.subscription.plus'],
  android: ['test.sub1', 'test.sub2']
});
