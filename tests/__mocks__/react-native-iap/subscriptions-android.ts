// import RNIap from 'react-native-iap';

// TODO: Add types: RNIap.Subscription<string>[] when this is fixed: https://github.com/dooboolab/react-native-iap/issues/694
const subscriptionsAndroid = [
  {
    currency: 'EUR',
    description: 'Monthly plus subscription',
    freeTrialPeriodAndroid: 'P3D',
    iconUrl: '',
    introductoryPrice: '',
    introductoryPriceCyclesAndroid: '',
    introductoryPricePeriodAndroid: '',
    localizedPrice: '€9.99',
    originalJson: '{"skuDetailsToken":"AEuhp4Ks3JP03AoJkZmWG3TJW7MwR9RyVhppRlBIxjAbWONb9zCGTTvrdI19OmOgUNJF","productId":"com.aardwegmedia.playpost.android.plus","type":"subs","price":"€9.99","price_amount_micros":9990000,"price_currency_code":"EUR","subscriptionPeriod":"P1M","freeTrialPeriod":"P3D","title":"Plus (Playpost)","description":"Monthly plus subscription"}',
    originalPrice: 9.989999771118164,
    price: 9.989999771118164,
    productId: 'com.aardwegmedia.playpost.android.plus',
    subscriptionPeriodAndroid: 'P1M',
    title: 'Plus (Playpost)',
    type: 'subs' as 'subs',
  },
  {
    currency: 'EUR',
    description: 'Monthly premium subscription',
    freeTrialPeriodAndroid: 'P3D',
    iconUrl: '',
    introductoryPrice: '',
    introductoryPriceCyclesAndroid: '',
    introductoryPricePeriodAndroid: '',
    localizedPrice: '€4.99',
    originalJson: '{"skuDetailsToken":"AEuhp4J1sih5sNOC8scNU522ERaTRpEV569wYp6zt_494j-pHoJwmrphuRT-ZrKh_FlK","productId":"com.aardwegmedia.playpost.android.premium","type":"subs","price":"€4.99","price_amount_micros":4990000,"price_currency_code":"EUR","subscriptionPeriod":"P1M","freeTrialPeriod":"P3D","title":"Premium (Playpost)","description":"Monthly premium subscription"}',
    originalPrice: 4.989999771118164,
    price: 4.989999771118164,
    productId: 'com.aardwegmedia.playpost.android.premium',
    subscriptionPeriodAndroid: 'P1M',
    title: 'Premium (Playpost)',
    type: 'subs' as 'sub',
  }
]

export default subscriptionsAndroid;
