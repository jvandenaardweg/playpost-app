import React from 'react';
import { View, Text, Linking, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import * as RNIap from 'react-native-iap';
import Config from 'react-native-config';

import { NetworkContext } from '../../contexts/NetworkProvider';

import * as Icon from '../Icon';
import fonts from '../../constants/fonts';

import styles from './styles';
import { URL_PRIVACY_POLICY, URL_TERMS_OF_USE } from '../../constants/urls';
import { ALERT_GENERIC_INTERNET_REQUIRED } from '../../constants/messages';
import { SUBSCRIPTION_PRODUCT_ID } from '../../constants/in-app-purchase';

import appleReceiptValidationMessages from '../../constants/apple-receipt-validation-messages';
import { connect } from 'react-redux';
import { selectSubscriptionsError, selectSubscriptions, selectSubscriptionsValidationResult } from '../../selectors/subscriptions';
import { RootState } from '../../reducers';
import { validateSubscriptionReceipt, getActiveSubscriptions } from '../../reducers/subscriptions';

interface State {
  readonly subscription: RNIap.Subscription<string>;
  readonly purchase: RNIap.ProductPurchase;
  readonly isLoadingBuySubscription: boolean;
  readonly isLoadingRestorePurchases: boolean;
  readonly isLoadingSubscriptionItems: boolean;
  readonly isPurchased: boolean;
}

type IProps = {
  onClose(): void;
  onPressSupport(): void;
};

type Props = IProps & StateProps & DispatchProps;

export class UpgradeContainer extends React.PureComponent<Props, State> {

  state = {
    subscription: {} as RNIap.Subscription<string>,
    purchase: {} as RNIap.ProductPurchase,
    isLoadingBuySubscription: false,
    isLoadingRestorePurchases: false,
    isLoadingSubscriptionItems: false,
    isPurchased: false
  };

  static contextType = NetworkContext;

  /* tslint:disable-next-line no-any */
  subscriptionPurchaseListener: any = null;

  componentDidMount() {
    const { isConnected } = this.context;

    // For now, just close the screen when there's no active internet connection
    // TODO: make more user friendly to show upgrade features when there's no internet connection
    if (!isConnected) {
      this.props.onClose();
      return Alert.alert('Upgrading requires internet', ALERT_GENERIC_INTERNET_REQUIRED);
    }

    this.fetchAvailableSubscriptionItems(SUBSCRIPTION_PRODUCT_ID);
  }

  componentWillUnmount() {
    RNIap.endConnection();

    this.props.getActiveSubscriptions();

    // Remove the listeners gives an "Attempted to remove more RNiapIos listeners than added"
    // this.subscriptionPurchaseListener && this.subscriptionPurchaseListener.remove();
  }

  // TODO: https://github.com/dooboolab/react-native-iap#ios-purchasing-process-right-way
  // Validate receipt on server

  showAlert = (title: string, message: string) => {
    return Alert.alert(
      title,
      message,
      [
        {
          text: 'Close',
          style: 'cancel'
        },
        {
          text: 'Contact support',
          onPress: () => this.props.onPressSupport()
        }
      ]
    );
  }

  handleOnPressUpgrade = async () => {
    try {
      await this.buySubscriptionItem(SUBSCRIPTION_PRODUCT_ID);

      // TODO: set user as premium in app

      this.props.onClose();
    } catch (err) {
      const errorMessage = (err && err.message) ? err.message : 'An unknown error happened while buying a subscription.';
      return this.showAlert('Buy Subscription Error', errorMessage);
    }
  }

  handleOnPressRestore = async () => {
    const { validationResult } = this.props;

    return this.setState({ isLoadingRestorePurchases: true }, async () => {
      try {
        // Get the previous purchases of the current user
        const purchases = await RNIap.getAvailablePurchases();

        if (!purchases.length) return new Error('We could not find a subscription purchase to restore. If you had a subscription before, it might be expired. If you think this is incorrect, contact our support or e-mail at info@playpost.app.');

        // Get the latest receipt from the purchases to validate
        const latestReceipt = await this.getLatestReceipt(purchases, SUBSCRIPTION_PRODUCT_ID);

        // Validate the receipt on our server
        const result = await this.validateReceiptOnServer(latestReceipt, SUBSCRIPTION_PRODUCT_ID);

        // TODO: set user as premium in app

        if (validationResult.isExpired) {
          return new Error('Your previous subscription is expired. In order to use our Premium features, you need to buy a new subscription.');
        }

        if (validationResult.isCanceled) {
          return new Error('Your previous subscription is canceled. In order to use our Premium features, you need to buy a new subscription again.');
        }

        if (validationResult.status !== 'active') {
          return new Error('Your previous subscription is not active, it is probably canceled or expired. In order to use our Premium features, you need to buy a new subscription.');
        }

        debugger;

        // If we end up here, the subscription is still active

        Alert.alert('Restore Successful', 'You successfully restored the subscription! You can now use the extra features.');
        return this.props.onClose();
      } catch (err) {
        const errorMessage = (err && err.message) ? err.message : 'An unknown error happened while restoring a subscription.';
        return this.showAlert('Restore purchase error', errorMessage);
      } finally {
        return this.setState({ isLoadingRestorePurchases: false });
      }
    });
  }

  fetchAvailableSubscriptionItems = async (subscriptionProductId: string) => {
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
          const errorMessage = (err && err.message) ? err.message : 'An unknown error happened while fetching the available subscriptions';
          Alert.alert('Oops!', errorMessage);
        });
      }
    });
  }

  buySubscriptionItem = async (subscriptionProductId: string) => {
    return new Promise((resolve, reject) => {
      return this.setState({ isLoadingBuySubscription: true }, async () => {
        try {
          const purchase = await RNIap.buySubscription(subscriptionProductId);

          if (!purchase) return new Error('Failed to buy the subscription. Please try again.');

          // TODO: validate on API
          // TODO: use transaction in here
          const latestReceipt = await this.validateReceiptOnServer(purchase.transactionReceipt, subscriptionProductId);

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

  getLatestReceipt = (purchases: RNIap.ProductPurchase[], subscriptionProductId: string): Promise<string> => {
    return new Promise((resolve, reject) => {

      // First, sort the array, so the latest purchase is on top
      const sortedPurchases = purchases.sort((a, b) => b.transactionDate - a.transactionDate);

      // Find the latest purchase based on the subscription productId
      const purchase = sortedPurchases.find(purchase => purchase.productId === subscriptionProductId);

      if (!purchase) return reject(new Error('We could not find a purchase to restore inside your previous purchases.\n\n If you had a subscription before, it might be expired. If you think this is incorrect, contact our support or e-mail at info@playpost.app.'));

      return resolve(purchase.transactionReceipt);
    });
  }

  validateReceiptOnServer = async (transactionReceipt: string, subscriptionProductId: string) => {
    const { subscriptions } = this.props;

    // Find the subscription based on the productId
    const subscription = subscriptions.find(subscription => subscription.productId === subscriptionProductId);

    if (!subscription) return new Error('Could not find an active subscription.');

    try {
      const result = await this.props.validateSubscriptionReceipt(subscription.id, transactionReceipt);
      // validated!
      // TODO: Now check if it's still valid
      // check isExpired, isCanceled, status
      return result;
    } catch (err) {
      // failed to validate
      throw err;
    }
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
      const errorMessage = (validationMessage) ? validationMessage : 'An unknown error happened while validating a subscription receipt.\n\n Are you sure you have an active subscription?';
      return new Error(errorMessage);
    }

    return result.latest_receipt;
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

interface StateProps {
  subscriptionsError: ReturnType<typeof selectSubscriptionsError>;
  subscriptions: ReturnType<typeof selectSubscriptions>;
  validationResult: ReturnType<typeof selectSubscriptionsValidationResult>;
}

interface DispatchProps {
  validateSubscriptionReceipt: typeof validateSubscriptionReceipt;
  getActiveSubscriptions: typeof getActiveSubscriptions;
}

const mapStateToProps = (state: RootState): StateProps => ({
  subscriptionsError: selectSubscriptionsError(state),
  subscriptions: selectSubscriptions(state),
  validationResult: selectSubscriptionsValidationResult(state)
});

const mapDispatchToProps = {
  validateSubscriptionReceipt,
  getActiveSubscriptions
};

export const Upgrade = connect(
  mapStateToProps,
  mapDispatchToProps
)(UpgradeContainer);
