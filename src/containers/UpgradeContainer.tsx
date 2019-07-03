import React from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { connect } from 'react-redux';
import * as RNIap from 'react-native-iap';
import isEqual from 'react-fast-compare';
import Analytics from 'appcenter-analytics';

import { withNavigation, NavigationScreenProp, NavigationRoute } from 'react-navigation';

import { Upgrade } from '../components/Upgrade';

import { NetworkContext } from '../contexts/NetworkProvider';

import {
  ALERT_GENERIC_INTERNET_REQUIRED,
  ALERT_SUBSCRIPTION_BUY_SUCCESS,
  ALERT_SUBSCRIPTION_RESTORE_PURCHASE_NOT_FOUND,
  ALERT_SUBSCRIPTION_RESTORE_SUCCESS,
  ALERT_SUBSCRIPTION_INIT_FAIL
} from '../constants/messages';
import { SUBSCRIPTION_PRODUCT_IDS } from '../constants/in-app-purchase';

import { selectSubscriptionsError, selectSubscriptionsValidationResult, selectActiveSubscriptionProductId } from '../selectors/subscriptions';
import { RootState } from '../reducers';
import { validateSubscriptionReceipt } from '../reducers/subscriptions';
import { URL_FEEDBACK, URL_PRIVACY_POLICY, URL_TERMS_OF_USE, URL_MANAGE_APPLE_SUBSCRIPTIONS } from '../constants/urls';
import { selectUserDetails } from '../selectors/user';

interface State {
  readonly subscriptions: RNIap.Subscription<string>[];
  readonly isLoadingBuySubscription: boolean;
  readonly isLoadingRestorePurchases: boolean;
  readonly isLoadingSubscriptionItems: boolean;
  readonly isPurchased: boolean;
  readonly selectedProductId: string;
}

type IProps = {
  navigation: NavigationScreenProp<NavigationRoute>;
};

type Props = IProps & StateProps & DispatchProps;

export class UpgradeContainerComponent extends React.PureComponent<Props, State> {
  state = {
    subscriptions: [] as RNIap.Subscription<string>[],
    isLoadingBuySubscription: false,
    isLoadingRestorePurchases: false,
    isLoadingSubscriptionItems: false,
    isPurchased: false,
    selectedProductId: ''
  };

  static contextType = NetworkContext;

  /* tslint:disable-next-line no-any */
  purchaseUpdateSubscription: any = null;

  /* tslint:disable-next-line no-any */
  purchaseErrorSubscription: any = null;

  async componentDidMount() {
    const { isConnected } = this.context;
    const { userDetails } = this.props;
    const analyticsUserId = `${userDetails && userDetails.id}`;

    // For now, just close the screen when there's no active internet connection
    // TODO: make more user friendly to show upgrade features when there's no internet connection
    if (!isConnected) {
      this.handleClose();
      return Alert.alert('Upgrading requires internet', ALERT_GENERIC_INTERNET_REQUIRED);
    }

    this.fetchAvailableSubscriptionItems(SUBSCRIPTION_PRODUCT_IDS);

    this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase: RNIap.ProductPurchase) => {
      const { selectedProductId } = this.state;

      try {
        // Validatation error is handeled in ErrorAlertContainer
        // The validation result is handled in componentDidUpdate
        await this.props.validateSubscriptionReceipt(selectedProductId, purchase.transactionReceipt);
        Analytics.trackEvent('Subscriptions upgrade success', { Status: 'success', ProductId: purchase.productId, UserId: analyticsUserId });
      } finally {
        this.setState({ isLoadingRestorePurchases: false, isLoadingBuySubscription: false, selectedProductId: '' });
      }
    });

    this.purchaseErrorSubscription = RNIap.purchaseErrorListener(async (error: RNIap.PurchaseError) => {
      const errorMessage = JSON.stringify(error);

      Analytics.trackEvent('Subscriptions upgrade error', {
        Status: 'error',
        Message: errorMessage,
        ProductId: this.state.selectedProductId,
        UserId: analyticsUserId
      });

      this.showErrorAlert('Oops!', `An error happened. Please contact our support with this information:\n\n ${errorMessage}`);

      this.setState({ isLoadingRestorePurchases: false, isLoadingBuySubscription: false, selectedProductId: '' });
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

  handleClose() {
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

  handleOpenPrivacy = () => Linking.openURL(`${URL_PRIVACY_POLICY}?ref=playpost://upgrade`);
  handleOpenTerms = () => Linking.openURL(`${URL_TERMS_OF_USE}?ref=playpost://upgrade`);

  showErrorAlert = (title: string, message: string) => {
    return Alert.alert(title, message, [
      {
        text: 'Close',
        style: 'cancel'
      },
      {
        text: 'Contact support',
        onPress: () => this.props.navigation.navigate('Browser', { url: URL_FEEDBACK, title: 'Support' })
      }
    ]);
  }

  handleOnPressCancel = () => {
    if (Platform.OS === 'android') {
      return this.showManageSubscriptionAlert(
        'Cancel your subscription?',
        'Cancelling a subscription can only be done through the Google Play Store.\n\nOpen the Google Play Store > Subscriptions. Select the subscription you want to cancel and tap "Cancel subscription".'
      );
    }

    return this.showManageSubscriptionAlert(
      'Cancel your subscription?',
      'Cancelling a subscription can only be done through iTunes.\n\n Press "Manage Subscriptions" below to manage your subscriptions.'
    );
  }

  showManageSubscriptionAlert = (title: string, message: string) => {
    const { userDetails } = this.props;
    const analyticsUserId = `${userDetails && userDetails.id}`;

    let manageSubscriptionsButton: object = {
      text: 'Manage Subscriptions',
      onPress: () => {
        Analytics.trackEvent('Subscriptions manage press', { ProductId: this.state.selectedProductId, UserId: analyticsUserId });
        Linking.openURL(URL_MANAGE_APPLE_SUBSCRIPTIONS);
      }
    };

    if (Platform.OS === 'android') {
      manageSubscriptionsButton = {};
    }

    return Alert.alert(title, message, [
      manageSubscriptionsButton,
      {
        text: 'OK',
        style: 'cancel'
      }
    ]);
  }

  handleOnPressUpgrade = async (productId: string) => {
    const { userDetails } = this.props;
    const analyticsUserId = `${userDetails && userDetails.id}`;

    // If it's a downgrade to an other paid subscription
    if (this.isDowngradePaidSubscription(productId)) {
      Analytics.trackEvent('Subscriptions downgrade', { Status: 'alert', ProductId: productId, UserId: analyticsUserId });

      return this.showManageSubscriptionAlert(
        'Downgrading Subscription?',
        'Downgrading a subscription can only be done through iTunes.\n\n Press "Manage Subscriptions" below to manage your subscriptions.'
      );
    }

    // If it's a downgrade to "free"
    if (this.isDowngradeFreeSubscription(productId)) {
      Analytics.trackEvent('Subscriptions downgrade', { Status: 'alert', ProductId: productId, UserId: analyticsUserId });

      return this.showManageSubscriptionAlert(
        'Downgrade to Free?',
        'To downgrade to Free you need to cancel your current subscription. Cancelling a subscription can only be done through iTunes.\n\n Press "Manage Subscriptions" below to manage your subscriptions.'
      );
    }

    Analytics.trackEvent('Subscriptions upgrade', { Status: 'upgrading', ProductId: productId, UserId: analyticsUserId });

    return this.setState({ isLoadingBuySubscription: true, selectedProductId: productId }, async () => {
      try {
        const upgradeResult = await RNIap.requestSubscription(productId);
        return upgradeResult;
      } catch (err) {
        const errorMessage = err && err.message ? err.message : 'An uknown error happened while upgrading.';

        // We don't do anything with this message, as errors are handled by: purchaseErrorListener

        console.log(err);
        console.log(errorMessage);

        return err;
      }
    });
  }

  isDowngradePaidSubscription = (productId: string): boolean => {
    const { activeSubscriptionProductId } = this.props;
    const { subscriptions } = this.state;

    const subscriptionToUpgradeTo = subscriptions.find(subscription => subscription.productId === productId);
    const currentSubscription = subscriptions.find(subscription => subscription.productId === activeSubscriptionProductId);

    if (!subscriptionToUpgradeTo) return false;
    if (!currentSubscription) return false;

    return Number(subscriptionToUpgradeTo.price) < Number(currentSubscription.price);
  }

  isDowngradeFreeSubscription = (productId: string): boolean => {
    const { activeSubscriptionProductId } = this.props;
    return productId === 'free' && activeSubscriptionProductId !== 'free';
  }

  handleOnPressRestore = async () => {
    const { userDetails } = this.props;
    const analyticsUserId = `${userDetails && userDetails.id}`;

    Analytics.trackEvent('Subscriptions restore', { Status: 'restoring', UserId: analyticsUserId });

    return this.setState({ isLoadingRestorePurchases: true }, async () => {
      try {
        // Get the previous purchases of the current user
        const purchases = await RNIap.getAvailablePurchases();

        // Get the latest receipt from the purchases to validate
        const { transactionReceipt, productId } = this.getLatestPurchase(purchases);

        // Validate the receipt on our server
        await this.props.validateSubscriptionReceipt(productId, transactionReceipt);

        Analytics.trackEvent('Subscriptions restore success', { Status: 'success', ProductId: productId, UserId: analyticsUserId });

        // The validation result is handled in componentDidUpdate
      } catch (err) {
        const errorMessage = err && err.message ? err.message : 'An unknown error happened while restoring a subscription.';
        Analytics.trackEvent('Subscriptions restore error', { Status: 'error', Message: errorMessage, UserId: analyticsUserId });

        this.showErrorAlert('Restore purchase error', errorMessage);
      } finally {
        this.setState({ isLoadingRestorePurchases: false });
      }
    });
  }

  fetchAvailableSubscriptionItems = async (subscriptionProductIds: string[]) => {
    return this.setState({ isLoadingSubscriptionItems: true }, async () => {
      try {
        const result = await RNIap.initConnection();

        if (!result) throw new Error(ALERT_SUBSCRIPTION_INIT_FAIL);

        // Pre-populate the app with subscriptions and previous purchases of the user
        const subscriptions = await RNIap.getSubscriptions(subscriptionProductIds);

        // Re-order the subscriptions
        // const cheapestSubscriptionFirst = subscriptions.sort((a, b) => Number(a.price) - Number(b.price));

        return this.setState({ subscriptions, isLoadingSubscriptionItems: false }, () => subscriptions);
      } catch (err) {
        const errorMessage = err && err.message ? err.message : 'An unknown error happened while fetching the available subscriptions';

        return this.setState({ isLoadingSubscriptionItems: false }, () => {
          return this.showErrorAlert('Oops!', errorMessage);
        });
      }
    });
  }

  getLatestPurchase = (purchases: RNIap.ProductPurchase[]): RNIap.ProductPurchase => {
    if (!purchases.length) {
      throw new Error(ALERT_SUBSCRIPTION_RESTORE_PURCHASE_NOT_FOUND);
    }

    // First, sort the array, so the latest purchase is on top
    const sortedPurchases = [...purchases].sort((a, b) => b.transactionDate - a.transactionDate);

    // Find the latest purchase based on the subscription productId
    const purchase = sortedPurchases[0];

    if (!purchase) {
      throw new Error(
        'We could not find a purchase to restore inside your previous purchases.\n\n If you had a subscription before, it might be expired. If you think this is incorrect, contact our support or e-mail at info@playpost.app.'
      );
    }

    return purchase;
  }

  get subscriptionFeatures() {
    return [
      {
        productId: 'free',
        title: 'Free',
        price: '0',
        body: [
          'Basic quality voices',
          'One voice per language',
          'Max. 5 minutes per article',
          'Max. 30 minutes per month',
          'Unlimited playlist items',
          'Some advertisements'
        ],
        footer: 'About 5 articles to audio, per month'
      },
      {
        productId: 'com.aardwegmedia.playpost.premium',
        title: 'Premium',
        price: null,
        body: [
          '30+ High Quality voices',
          'Multiple voices per language',
          'Max. 15 minutes per article',
          'Max. 120 minutes per month',
          'Unlimited playlist items',
          'No advertisements'
        ],
        footer: 'About 25 articles to audio, per month'
      },
      {
        productId: 'com.aardwegmedia.playpost.subscription.plus',
        title: 'Plus',
        price: null,
        body: [
          '90+ High Quality voices',
          'Multiple voices per language',
          'Max. 25 minutes per article',
          'Max. 300 minutes per month',
          'Unlimited playlist items',
          'No advertisements'
        ],
        footer: 'About 65 articles to audio, per month'
      }
    ];
  }

  render() {
    const { isLoadingRestorePurchases, isLoadingBuySubscription, isLoadingSubscriptionItems, subscriptions } = this.state;
    const { activeSubscriptionProductId } = this.props;

    return (
      <Upgrade
        isLoadingSubscriptionItems={isLoadingSubscriptionItems}
        isLoadingBuySubscription={isLoadingBuySubscription}
        isLoadingRestorePurchases={isLoadingRestorePurchases}
        subscriptions={subscriptions}
        activeSubscriptionProductId={activeSubscriptionProductId}
        subscriptionFeatures={this.subscriptionFeatures}
        onPressUpgrade={this.handleOnPressUpgrade}
        onPressRestore={this.handleOnPressRestore}
        onPressPrivacy={this.handleOpenPrivacy}
        onPressTerms={this.handleOpenTerms}
        onPressCancel={this.handleOnPressCancel}
        isDowngradePaidSubscription={this.isDowngradePaidSubscription}
      />
    );
  }
}

interface StateProps {
  subscriptionsError: ReturnType<typeof selectSubscriptionsError>;
  validationResult: ReturnType<typeof selectSubscriptionsValidationResult>;
  activeSubscriptionProductId: ReturnType<typeof selectActiveSubscriptionProductId>;
  userDetails: ReturnType<typeof selectUserDetails>;
}

interface DispatchProps {
  validateSubscriptionReceipt: typeof validateSubscriptionReceipt;
}

const mapStateToProps = (state: RootState): StateProps => ({
  subscriptionsError: selectSubscriptionsError(state),
  validationResult: selectSubscriptionsValidationResult(state),
  activeSubscriptionProductId: selectActiveSubscriptionProductId(state),
  userDetails: selectUserDetails(state)
});

const mapDispatchToProps = {
  validateSubscriptionReceipt
};

export const UpgradeContainer = withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UpgradeContainerComponent)
);
