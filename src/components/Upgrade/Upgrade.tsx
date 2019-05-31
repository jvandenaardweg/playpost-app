import React from 'react';
import { View, Text, Linking, Alert, EmitterSubscription } from 'react-native';
import { Button } from 'react-native-elements';
import * as RNIap from 'react-native-iap';
import Config from 'react-native-config';

import { NetworkContext } from '../../contexts/NetworkProvider';

import * as Icon from '../Icon';
import fonts from '../../constants/fonts';

import { subscriptionProductId } from '../../billing';

import styles from './styles';
import { URL_PRIVACY_POLICY, URL_TERMS_OF_USE } from '../../constants/urls';
import { ALERT_GENERIC_INTERNET_REQUIRED } from '../../constants/messages';

import appleReceiptValidationMessages from '../../constants/apple-receipt-validation-messages';


interface State {
  readonly subscription: RNIap.Subscription<string>;
  readonly purchase: RNIap.ProductPurchase;
  readonly isLoadingBuySubscription: boolean;
  readonly isLoadingRestorePurchases: boolean;
  readonly isLoadingSubscriptionItems: boolean;
  readonly isPurchased: boolean;
}

type Props = {
  onClose(): void;
};
export class Upgrade extends React.PureComponent<Props, State> {

  state = {
    subscription: {} as RNIap.Subscription<string>,
    purchase: {} as RNIap.ProductPurchase,
    isLoadingBuySubscription: false,
    isLoadingRestorePurchases: false,
    isLoadingSubscriptionItems: false,
    isPurchased: false
  };

  static contextType = NetworkContext;

  subscriptionPurchaseListener: any = null;

  componentDidMount() {
    const { isConnected } = this.context;

    // For now, just close the screen when there's no active internet connection
    // TODO: make more user friendly to show upgrade features when there's no internet connection
    if (!isConnected) {
      this.props.onClose();
      return Alert.alert('Upgrading requires internet', ALERT_GENERIC_INTERNET_REQUIRED);
    }

    this.fetchAvailableSubscriptionItems();
  }

  componentWillUnmount() {
    RNIap.endConnection();

    this.subscriptionPurchaseListener && this.subscriptionPurchaseListener.remove();
  }

  // TODO: https://github.com/dooboolab/react-native-iap#ios-purchasing-process-right-way
  // Validate receipt on server

  handleOnPressUpgrade = async () => {
    try {
      await this.buySubscriptionItem(subscriptionProductId);

      // TODO: set user as premium in app

      this.props.onClose();
    } catch (err) {
      return Alert.alert('Buy Subscription Error', (err.message) ? err.message : 'An unknown error happened.');
    }
  }

  handleOnPressRestore = async () => {
    try {
      await this.restorePurchases();

      Alert.alert('Restore Successful', 'You successfully restored the subscription! You can now use the extra features.');

      // TODO: set user as premium in app

      this.props.onClose();
    } catch (err) {
      return Alert.alert('Restore purchase error', (err.message) ? err.message : 'An unknown error happened.');
    }
  }

  fetchAvailableSubscriptionItems = async () => {
    return this.setState({ isLoadingSubscriptionItems: true }, async () => {
      try {
        const result = await RNIap.initConnection();

        if (!result) return new Error('Could not set up a connection to the App Store. Please try again later.');

        await RNIap.consumeAllItems();

        const subscriptions = await RNIap.getSubscriptions([subscriptionProductId]);

        // Only get the Premium product
        const subscription = subscriptions.find(subscription => subscription.productId === subscriptionProductId);

        if (!subscription) return new Error('We could not get the subscription to purchase. Please try again later.');

        return this.setState({ subscription, isLoadingSubscriptionItems: false }, () => subscription);
      } catch (err) {
        return this.setState({ isLoadingSubscriptionItems: false }, () => {
          Alert.alert('Oops!', err.message);
        });
      }
    });
  }

  buySubscriptionItem = async (sku: string) => {
    return new Promise((resolve, reject) => {
      return this.setState({ isLoadingBuySubscription: true }, async () => {
        try {
          const purchase = await RNIap.buySubscription(sku);

          if (!purchase) return new Error('Failed to buy the subscription. Please try again.');

          await this.validateReceipt(purchase.transactionReceipt);

          // TODO: add purchase check on app load
          return this.setState({ purchase, isLoadingBuySubscription: false }, () => resolve(true));
        } catch (err) {

          // Most likely, you'll want to handle the 'store kit flow' (detailed here), which happens when a user succesfully pays after
          // solving a problem with his or her account - for example, when the credit card information has expired. In this scenario,
          // the initial call to RNIap.buyProduct would fail and you'd need to add addAdditionalSuccessPurchaseListenerIOS to handle the successful purchase.
          // Otherwise, you'll be in a scenario where the user paid but your application is not aware of it
          // From: https://github.com/dooboolab/react-native-iap#purchase
          this.subscriptionPurchaseListener = RNIap.addAdditionalSuccessPurchaseListenerIOS(async (purchase: RNIap.ProductPurchase) => {
            await this.validateReceipt(purchase.transactionReceipt);

            return this.setState({ purchase, isLoadingBuySubscription: false }, () => {
              this.subscriptionPurchaseListener.remove();
              return resolve(true);
            });
          });

          return this.setState({ isLoadingBuySubscription: false }, () => reject(err));
        }
      });
    });
  }

  isPurchased = (purchases: RNIap.ProductPurchase[], subscriptionProductId: string): Promise<RNIap.ProductPurchase> => {
    return new Promise((resolve, reject) => {

      // First, sort the array, so the latest purchase is on top
      const sortedPurchases = purchases.sort((a, b) => a.transactionDate + b.transactionDate);

      // TODO: is this the right purchase to validate?
      const purchase = sortedPurchases.find(purchase => purchase.productId === subscriptionProductId);

      if (!purchase) return reject(null);
      debugger;
      return resolve(purchase);
    });
  }

  // TODO: do on server
  validateReceipt = async (transactionReceipt: string) => {
    const isTestEnvironment = Config.NODE_ENV !== 'production';

    const receiptBody = {
      'receipt-data': transactionReceipt,
      password: Config.APPLE_IAP_SHARED_SECRET
    };

    const result = await RNIap.validateReceiptIos(receiptBody, isTestEnvironment);

    if (!result) return new Error('An unknown error happened while trying to validate a subscription receipt.');

    if (result.status && result.status !== 0) {
      const validationMessage = (appleReceiptValidationMessages[result.status]);
      const errorMessage = (validationMessage) ? validationMessage : 'An unknown error happened while validating a subscription receipt. Are you sure you have an active subscription?';
      return new Error(errorMessage);
    }

    return result;
  }

  /**
   * Method to restore any previous purchases
   */
  restorePurchases = async() => {
    return new Promise((resolve, reject) => {
      return this.setState({ isLoadingRestorePurchases: true }, async () => {
        try {
          //
          const purchases = await RNIap.getAvailablePurchases();

          if (!purchases.length) return new Error('We could not find any previous purchases to restore.');

          const purchase = await this.isPurchased(purchases, subscriptionProductId);

          if (!purchase) return new Error('We could not find any previous purchases to restore.');

          await this.validateReceipt(purchase.transactionReceipt);

          // https://developer.apple.com/library/archive/releasenotes/General/ValidateAppStoreReceipt/Chapters/ValidateRemotely.html
          // A status of 0 means the receipt is valid

          // If we end up here, result.status === 0 and the purchase is valid

          return this.setState({ purchase, isLoadingRestorePurchases: false }, () => resolve(purchase));
        } catch (err) {
          return this.setState({ isLoadingRestorePurchases: false }, () => reject(err));
        }
      });
    });
  }

  get buttonTitle() {
    const { subscription } = this.state;
    return `Upgrade for ${subscription.localizedPrice} per month`;
  }

  get isLoading() {
    const { isLoadingSubscriptionItems, isLoadingBuySubscription } = this.state;
    const { isConnected } = this.context;

    return (isConnected && (isLoadingBuySubscription || isLoadingSubscriptionItems));
  }

  render() {
    const { isLoadingRestorePurchases } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.feature}>
            <Icon.FontAwesome5 name="gem" size={28} style={styles.featureIcon} />
            <View style={styles.featureContent}>
              <Text style={styles.title}>Higher quality voices</Text>
              <Text style={styles.paragraph}>Besided the free voices, you can use our highest quality Premium voices. You can preview these Premium voices in the settings screen.</Text>
            </View>
          </View>
          <View style={styles.feature}>
            <Icon.FontAwesome5 name="assistive-listening-systems" solid size={28} style={styles.featureIcon} />
            <View style={styles.featureContent}>
              <Text style={styles.title}>More voice customization options</Text>
              <Text style={styles.paragraph}>Choose between a variety of high quality male and female voices with accents like American, British or Australian English.</Text>
            </View>
          </View>
          <View style={styles.feature}>
            <Icon.FontAwesome5 name="clock" size={28} style={styles.featureIcon} />
            <View style={styles.featureContent}>
              <Text style={styles.title}>Unlimited listening</Text>
              <Text style={styles.paragraph}>No article limits. Listen to articles longer then 5 minutes.</Text>
            </View>
          </View>
          <View style={styles.feature}>
            <Icon.FontAwesome5 name="headphones-alt" size={28} style={styles.featureIcon} />
            <View style={styles.featureContent}>
              <Text style={styles.title}>Playlist auto-play</Text>
              <Text style={styles.paragraph}>Automatically play the next article in your playlist.</Text>
            </View>
          </View>
          <View style={styles.feature}>
            <Icon.FontAwesome5 name="star" solid size={28} style={styles.featureIcon} />
            <View style={styles.featureContent}>
              <Text style={styles.title}>No advertisements</Text>
              <Text style={styles.paragraph}>Sponsored content helps us continue to provide a free version of Playpost. After upgrading to Playpost Premium, you won’t see any ads, and you’ll be supporting Playpost more directly!</Text>
            </View>
          </View>
        </View>

        <View style={styles.subscribeContainer}>
          <Button title={this.buttonTitle} onPress={() => this.handleOnPressUpgrade()} loading={this.isLoading} />
          <Button type="clear" title="Already upgraded? Restore purchase" loading={isLoadingRestorePurchases} onPress={() => this.handleOnPressRestore()} titleStyle={{ fontSize: fonts.fontSize.body }} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Payment will be charged to your Apple ID account at the confirmation of purchase. Subscription automatically renews unless it is canceled at least 24 hours before the end of the current period. Your account will be charged for renewal within 24 hours prior to the end of the current period. You can manage and cancel your subscriptions by going to your account settings on the App Store after purchase.</Text>
          <View style={styles.footerLinks}>
            <Text style={[styles.footerText, styles.textHighlight]} onPress={() => Linking.openURL(`${URL_PRIVACY_POLICY}?ref=playpost://upgrade`)}>Privacy Policy</Text>
            <Text> - </Text>
            <Text style={[styles.footerText, styles.textHighlight]} onPress={() => Linking.openURL(`${URL_TERMS_OF_USE}?ref=playpost://upgrade`)}>Terms of Use</Text>
          </View>
        </View>

      </View>
    );
  }
}
