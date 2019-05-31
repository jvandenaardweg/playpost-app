import { Platform } from 'react-native';

export const SUBSCRIPTION_PRODUCT_ID = Platform.select({
  ios: 'com.aardwegmedia.playpost.premium',
  android: 'test.sub1'
});
