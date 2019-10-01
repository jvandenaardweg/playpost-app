import * as RNIap from 'react-native-iap';

const subscriptionsAndroid: RNIap.Subscription[] = [
  {
    currency: 'EUR',
    description: 'Monthly plus subscription',
    freeTrialPeriodAndroid: 'P3D',
    introductoryPrice: '',
    introductoryPriceCyclesAndroid: '',
    introductoryPricePeriodAndroid: '',
    localizedPrice: '€9.99',
    price: '9.989999771118164',
    productId: 'com.aardwegmedia.playpost.android.plus',
    subscriptionPeriodAndroid: 'P1M',
    title: 'Plus (Playpost)',
    type: 'subs' as 'subs',
  },
  {
    currency: 'EUR',
    description: 'Monthly premium subscription',
    freeTrialPeriodAndroid: 'P3D',
    introductoryPrice: '',
    introductoryPriceCyclesAndroid: '',
    introductoryPricePeriodAndroid: '',
    localizedPrice: '€4.99',
    price: '4.989999771118164',
    productId: 'com.aardwegmedia.playpost.android.premium',
    subscriptionPeriodAndroid: 'P1M',
    title: 'Premium (Playpost)',
    type: 'subs' as 'sub',
  }
]

export default subscriptionsAndroid;
