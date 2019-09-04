import RNIap from 'react-native-iap';

// TODO: Add types: RNIap.Subscription<string>[] when this is fixed: https://github.com/dooboolab/react-native-iap/issues/694
const subscriptionsIos: Array<RNIap.Subscription<string>> = [
  {
    currency: 'EUR',
    description: 'Premium monthly subscription',
    // discounts: [],
    introductoryPrice: '€ 0,00',
    introductoryPriceNumberOfPeriodsIOS: '3',
    introductoryPricePaymentModeIOS: 'FREETRIAL',
    introductoryPriceSubscriptionPeriodIOS: 'DAY',
    localizedPrice: '€ 4,99',
    price: '4.99',
    productId: 'com.aardwegmedia.playpost.premium',
    subscriptionPeriodNumberIOS: '1',
    subscriptionPeriodUnitIOS: 'MONTH',
    title: 'Premium',
    type: 'sub' as 'sub'
    // type: 'Do not use this. It returned sub only before'
  },
  {
    currency: 'EUR',
    description: 'Plus monthly subscription',
    // discounts: [],
    introductoryPrice: '€ 0,00',
    introductoryPriceNumberOfPeriodsIOS: '3',
    introductoryPricePaymentModeIOS: 'FREETRIAL',
    introductoryPriceSubscriptionPeriodIOS: 'DAY',
    localizedPrice: '€ 9,99',
    price: '9.99',
    productId: 'com.aardwegmedia.playpost.subscription.plus',
    subscriptionPeriodNumberIOS: '1',
    subscriptionPeriodUnitIOS: 'MONTH',
    title: 'Plus',
    type: 'sub' as 'sub'
    // type: 'Do not use this. It returned sub only before'
  }
]

export default subscriptionsIos;
