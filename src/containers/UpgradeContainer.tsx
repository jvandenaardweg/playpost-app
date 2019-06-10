import React from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import * as RNIap from 'react-native-iap';

import { Upgrade } from '../components/Upgrade';

import { NetworkContext } from '../contexts/NetworkProvider';

import { ALERT_GENERIC_INTERNET_REQUIRED } from '../constants/messages';
import { SUBSCRIPTION_PRODUCT_ID } from '../constants/in-app-purchase';

import { selectSubscriptionsError, selectSubscriptions, selectSubscriptionsValidationResult } from '../selectors/subscriptions';
import { RootState } from '../reducers';
import { validateSubscriptionReceipt, getActiveSubscriptions } from '../reducers/subscriptions';

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

export class UpgradeContainerComponent extends React.PureComponent<Props, State> {

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

  /* tslint:disable-next-line no-any */
  purchaseUpdateSubscription: any = null;

  componentDidMount() {
    const { validationResult } = this.props;
    const { isConnected } = this.context;

    // For now, just close the screen when there's no active internet connection
    // TODO: make more user friendly to show upgrade features when there's no internet connection
    if (!isConnected) {
      this.handleClose();
      return Alert.alert('Upgrading requires internet', ALERT_GENERIC_INTERNET_REQUIRED);
    }

    this.fetchAvailableSubscriptionItems(SUBSCRIPTION_PRODUCT_ID);

    // TODO: remove this ts-ignore when fixed: https://github.com/dooboolab/react-native-iap/issues/514
    // @ts-ignore
    this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase: RNIap.ProductPurchase) => {
      try {
        await this.validateReceiptOnServer(purchase.transactionReceipt, SUBSCRIPTION_PRODUCT_ID);

        if (validationResult.status !== 'active') {
          throw new Error(`Your subscription is ${validationResult.status}. In order to use our Premium features, you need to buy a new subscription.`);
        }

        this.setState({ purchase, isLoadingBuySubscription: false }, () => {
          Alert.alert('Upgrade success!', 'You can now use our premium features.');
          return this.handleClose();
        });
      } catch (err) {
        const errorMessage = (err && err.message) ? err.message : 'An uknown error happened while upgrading.';

        return this.setState({ isLoadingBuySubscription: false }, () =>
          this.showErrorAlert('Upgrade error', errorMessage)
        );
      }
    });
  }

  componentWillUnmount() {
    RNIap.endConnectionAndroid();
  }

  handleClose () {
    // Normally we should put this in componentWillUnmount
    // But, since the upgrade screen is part of React Navigation, unmount is not called in this context
    // So we manually handle the removal of event listeners
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }

    // Close the modal
    this.props.onClose();
  }

  showErrorAlert = (title: string, message: string) => {
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
    return this.setState({ isLoadingBuySubscription: true }, async () => {
      try {
        await RNIap.requestSubscription(SUBSCRIPTION_PRODUCT_ID);
      } catch (err) {
        const errorMessage = (err && err.message) ? err.message : 'An uknown error happened while upgrading.';

        return this.setState({ isLoadingBuySubscription: false }, () =>
          this.showErrorAlert('Upgrade error', errorMessage)
        );
      }
    });
  }

  handleOnPressRestore = async () => {
    const { validationResult } = this.props;

    return this.setState({ isLoadingRestorePurchases: true }, async () => {
      try {
        // Get the previous purchases of the current user
        const purchases = await RNIap.getAvailablePurchases();

        if (!purchases.length) {
          throw new Error('We could not find a subscription purchase to restore. If you had a subscription before, it might be expired. If you think this is incorrect, contact our support or e-mail at info@playpost.app.');
        }

        // Get the latest receipt from the purchases to validate
        const latestReceipt = await this.getLatestReceipt(purchases, SUBSCRIPTION_PRODUCT_ID);

        // Validate the receipt on our server
        await this.validateReceiptOnServer(latestReceipt, SUBSCRIPTION_PRODUCT_ID);

        if (validationResult.status !== 'active') {
          throw new Error(`Your previous subscription is ${validationResult.status}. In order to use our Premium features, you need to buy a new subscription.`);
        }

        // If we end up here, the subscription is still active

        Alert.alert('Restore Successful', 'You successfully restored the subscription! You can now use the extra features.');
        return this.handleClose();
      } catch (err) {
        const errorMessage = (err && err.message) ? err.message : 'An unknown error happened while restoring a subscription.';
        return this.showErrorAlert('Restore purchase error', errorMessage);
      } finally {
        return this.setState({ isLoadingRestorePurchases: false });
      }
    });
  }

  fetchAvailableSubscriptionItems = async (subscriptionProductId: string) => {
    return this.setState({ isLoadingSubscriptionItems: true }, async () => {
      try {
        const result = await RNIap.initConnection();

        if (!result) throw new Error('Could not set up a connection to the App Store. Please try again later.');

        // await RNIap.consumeAllItemsAndroid();

        const subscriptions = await RNIap.getSubscriptions([subscriptionProductId]);

        // Only get the Premium product
        const subscription = subscriptions.find(subscription => subscription.productId === subscriptionProductId);

        if (!subscription) throw new Error('We could not get the subscription to purchase. Please try again later.');

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
    const { validationResult } = this.props;

    return new Promise((resolve, reject) => {
      return this.setState({ isLoadingBuySubscription: true }, async () => {
        try {
          const purchase = await RNIap.buySubscription(subscriptionProductId);

          if (!purchase) throw new Error('Failed to buy the subscription. Please try again.');

          await this.validateReceiptOnServer(purchase.transactionReceipt, subscriptionProductId);

          if (validationResult.status !== 'active') {
            throw new Error('The purchase receipt does not seem to be active. Purchasing probably failed. Please contact our support.');
          }

          return this.setState({ purchase, isLoadingBuySubscription: false }, () => resolve(true));
        } catch (err) {

          // Most likely, you'll want to handle the 'store kit flow' (detailed here), which happens when a user succesfully pays after
          // solving a problem with his or her account - for example, when the credit card information has expired. In this scenario,
          // the initial call to RNIap.buyProduct would fail and you'd need to add addAdditionalSuccessPurchaseListenerIOS to handle the successful purchase.
          // Otherwise, you'll be in a scenario where the user paid but your application is not aware of it
          // From: https://github.com/dooboolab/react-native-iap#purchase
          this.subscriptionPurchaseListener = RNIap.addAdditionalSuccessPurchaseListenerIOS(async (purchase: RNIap.ProductPurchase) => {
            await this.validateReceiptOnServer(purchase.transactionReceipt, subscriptionProductId);

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

    if (!subscription) throw new Error('Could not find an active subscription to validate.');

    return this.props.validateSubscriptionReceipt(subscription.id, transactionReceipt);
  }

  get upgradeButtonTitle() {
    const { subscription } = this.state;
    return `Upgrade for ${subscription.localizedPrice} per month`;
  }

  render() {
    const { isLoadingRestorePurchases, isLoadingBuySubscription } = this.state;

    return (
      <Upgrade
        isLoadingBuySubscription={isLoadingBuySubscription}
        isLoadingRestorePurchases={isLoadingRestorePurchases}
        upgradeButtonTitle={this.upgradeButtonTitle}
        onPressUpgrade={this.handleOnPressUpgrade}
        onPressRestore={this.handleOnPressRestore}
      />
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

export const UpgradeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UpgradeContainerComponent);
