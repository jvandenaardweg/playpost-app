// import * as RNIap from 'react-native-iap';
import { Platform } from 'react-native';

export const subscriptionProductIds = Platform.select({
  ios: [
    'premium',
  ],
  android: [
    'test.sub1',
  ],
});
