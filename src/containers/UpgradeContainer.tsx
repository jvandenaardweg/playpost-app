import React from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import * as RNIap from 'react-native-iap';
import isEqual from 'react-fast-compare';

import { withNavigation, NavigationScreenProp, NavigationRoute } from 'react-navigation';

import { Upgrade } from '../components/Upgrade';

import { NetworkContext } from '../contexts/NetworkProvider';

import { ALERT_GENERIC_INTERNET_REQUIRED, ALERT_SUBSCRIPTION_BUY_SUCCESS, ALERT_SUBSCRIPTION_RESTORE_PURCHASE_NOT_FOUND, ALERT_SUBSCRIPTION_RESTORE_SUCCESS, ALERT_SUBSCRIPTION_INIT_FAIL, ALERT_SUBSCRIPTION_PURCHASE_SUBSCRIPTION_NOT_FOUND } from '../constants/messages';
import { SUBSCRIPTION_PRODUCT_ID } from '../constants/in-app-purchase';

import { selectSubscriptionsError, selectSubscriptionsValidationResult } from '../selectors/subscriptions';
import { RootState } from '../reducers';
import { validateSubscriptionReceipt } from '../reducers/subscriptions';
import { URL_FEEDBACK } from '../constants/urls';

interface State {
  readonly subscription: RNIap.Subscription<string>;
  readonly isLoadingBuySubscription: boolean;
  readonly isLoadingRestorePurchases: boolean;
  readonly isLoadingSubscriptionItems: boolean;
  readonly isPurchased: boolean;
}

type IProps = {
  navigation: NavigationScreenProp<NavigationRoute>;
};

type Props = IProps & StateProps & DispatchProps;

export class UpgradeContainerComponent extends React.PureComponent<Props, State> {

  state = {
    subscription: {} as RNIap.Subscription<string>,
    isLoadingBuySubscription: false,
    isLoadingRestorePurchases: false,
    isLoadingSubscriptionItems: false,
    isPurchased: false
  };

  static contextType = NetworkContext;

  /* tslint:disable-next-line no-any */
  purchaseUpdateSubscription: any = null;

  /* tslint:disable-next-line no-any */
  purchaseErrorSubscription: any = null;

  async componentDidMount() {
    const { isConnected } = this.context;

    // For now, just close the screen when there's no active internet connection
    // TODO: make more user friendly to show upgrade features when there's no internet connection
    if (!isConnected) {
      this.handleClose();
      return Alert.alert('Upgrading requires internet', ALERT_GENERIC_INTERNET_REQUIRED);
    }

    this.fetchAvailableSubscriptionItems(SUBSCRIPTION_PRODUCT_ID);

    this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase: RNIap.ProductPurchase) => {
      try {
        // Validatation error is handeled in ErrorAlertContainer
        // The validation result is handled in componentDidUpdate
        await this.props.validateSubscriptionReceipt(SUBSCRIPTION_PRODUCT_ID, purchase.transactionReceipt);
      } finally {
        this.setState({ isLoadingRestorePurchases: false, isLoadingBuySubscription: false });
      }
    });

    this.purchaseErrorSubscription = RNIap.purchaseErrorListener(async (error: RNIap.PurchaseError) => {
      this.showErrorAlert('Oops!', `An error happened. Please contact our support with this information:\n\n ${JSON.stringify(error)}`);
      this.setState({ isLoadingRestorePurchases: false, isLoadingBuySubscription: false });
    });
  }

  componentWillUnmount() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }

    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }

    RNIap.endConnectionAndroid();
  }

  componentDidUpdate(prevProps: Props) {
    const { isLoadingBuySubscription, isLoadingRestorePurchases } = this.state;
    const { validationResult } = this.props;

    // When we receive an API response when doing an upgrade...
    if (isLoadingBuySubscription && validationResult) {
      if (!isEqual(prevProps.validationResult, validationResult)) {
        this.handleClose();
        return Alert.alert('Upgrade success!', ALERT_SUBSCRIPTION_BUY_SUCCESS);
      }
    }

    // When we receive an API response when doing a restore...
    if (isLoadingRestorePurchases && validationResult) {
      // If we try to restore a previous purchase...
      if (!isEqual(prevProps.validationResult, validationResult)) {

        // Error!
        if (validationResult.status !== 'active') {
          return this.showErrorAlert(
            'Restore purchase error',
            `Your previous subscription is ${validationResult.status}. In order to use our Premium features, you need to buy a new subscription.`
          );
        }

        // Success!
        Alert.alert('Restore Successful', ALERT_SUBSCRIPTION_RESTORE_SUCCESS);
        return this.handleClose();
      }
    }
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
    this.props.navigation.goBack(null);
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
          onPress: () => this.props.navigation.navigate('Browser', { url: URL_FEEDBACK, title: 'Support' })
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

        // We don't do anything with this message, as errors are handled by: purchaseErrorListener

        console.log(errorMessage);

        // return this.setState({ isLoadingBuySubscription: false }, () =>
        //   this.showErrorAlert('Upgrade error', errorMessage)
        // );
      }
    });
  }

  handleOnPressRestore = async () => {
    return this.setState({ isLoadingRestorePurchases: true }, async () => {
      try {
        // Get the previous purchases of the current user
        const purchases = await RNIap.getAvailablePurchases();

        // Get the latest receipt from the purchases to validate
        const latestReceipt = this.getLatestReceipt(purchases, SUBSCRIPTION_PRODUCT_ID);

        // Validate the receipt on our server
        await this.props.validateSubscriptionReceipt(SUBSCRIPTION_PRODUCT_ID, latestReceipt);

        // The validation result is handled in componentDidUpdate
      } catch (err) {
        const errorMessage = (err && err.message) ? err.message : 'An unknown error happened while restoring a subscription.';
        this.showErrorAlert('Restore purchase error', errorMessage);
      } finally {
        this.setState({ isLoadingRestorePurchases: false });
      }
    });
  }

  fetchAvailableSubscriptionItems = async (subscriptionProductId: string) => {
    return this.setState({ isLoadingSubscriptionItems: true }, async () => {
      try {
        const result = await RNIap.initConnection();

        if (!result) throw new Error(ALERT_SUBSCRIPTION_INIT_FAIL);

        // Pre-populate the app with subscriptions and previous purchases of the user
        const subscriptions = await RNIap.getSubscriptions([subscriptionProductId]);

        // Validate if we've received the right subscriptions from Apple
        // We'll use the productId from our database entry to determine if we have it
        // So our database entries are correctly in sync
        const subscription = subscriptions.find(subscription => subscription.productId === subscriptionProductId);

        if (!subscription) throw new Error(ALERT_SUBSCRIPTION_PURCHASE_SUBSCRIPTION_NOT_FOUND);

        return this.setState({ subscription, isLoadingSubscriptionItems: false }, () => subscription);
      } catch (err) {
        const errorMessage = (err && err.message) ? err.message : 'An unknown error happened while fetching the available subscriptions';

        return this.setState({ isLoadingSubscriptionItems: false }, () => {
          return this.showErrorAlert('Oops!', errorMessage);
        });
      }
    });
  }

  getLatestReceipt = (purchases: RNIap.ProductPurchase[], subscriptionProductId: string): string => {
    if (!purchases.length) {
      throw new Error(ALERT_SUBSCRIPTION_RESTORE_PURCHASE_NOT_FOUND);
    }

    // First, sort the array, so the latest purchase is on top
    const sortedPurchases = purchases.sort((a, b) => b.transactionDate - a.transactionDate);

    // Find the latest purchase based on the subscription productId
    const purchase = sortedPurchases.find(purchase => purchase.productId === subscriptionProductId);

    if (!purchase) throw new Error('We could not find a purchase to restore inside your previous purchases.\n\n If you had a subscription before, it might be expired. If you think this is incorrect, contact our support or e-mail at info@playpost.app.');

    return purchase.transactionReceipt;
  }

  get upgradeButtonTitle() {
    const { subscription } = this.state;
    return `Upgrade for ${subscription.localizedPrice} per month`;
  }

  render() {
    const { isLoadingRestorePurchases, isLoadingBuySubscription, isLoadingSubscriptionItems, subscription } = this.state;

    return (
      <Upgrade
        isLoadingSubscriptionItems={isLoadingSubscriptionItems}
        isLoadingBuySubscription={isLoadingBuySubscription}
        isLoadingRestorePurchases={isLoadingRestorePurchases}
        localizedPrice={subscription.localizedPrice}
        upgradeButtonTitle={this.upgradeButtonTitle}
        onPressUpgrade={this.handleOnPressUpgrade}
        onPressRestore={this.handleOnPressRestore}
      />
    );
  }
}

interface StateProps {
  subscriptionsError: ReturnType<typeof selectSubscriptionsError>;
  validationResult: ReturnType<typeof selectSubscriptionsValidationResult>;
}

interface DispatchProps {
  validateSubscriptionReceipt: typeof validateSubscriptionReceipt;
}

const mapStateToProps = (state: RootState): StateProps => ({
  subscriptionsError: selectSubscriptionsError(state),
  validationResult: selectSubscriptionsValidationResult(state)
});

const mapDispatchToProps = {
  validateSubscriptionReceipt
};

export const UpgradeContainer =
  withNavigation(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(UpgradeContainerComponent)
  );
