import Analytics from 'appcenter-analytics';
import React from 'react';
import isEqual from 'react-fast-compare';
import { Alert, Linking, Platform } from 'react-native';
import * as RNIap from 'react-native-iap';
import { connect } from 'react-redux';

import { NavigationRoute, NavigationScreenProp } from 'react-navigation';

import { Upgrade } from '../components/Upgrade';

import { NetworkContext } from '../contexts/NetworkProvider';

import { SUBSCRIPTION_PRODUCT_IDS } from '../constants/in-app-purchase';
import {
  ALERT_GENERIC_INTERNET_REQUIRED,
  ALERT_SUBSCRIPTION_BUY_SUCCESS,
  ALERT_SUBSCRIPTION_INIT_FAIL,
  ALERT_SUBSCRIPTION_RESTORE_PURCHASE_NOT_FOUND,
  ALERT_SUBSCRIPTION_RESTORE_SUCCESS,
  ALERT_TITLE_ERROR_NO_INTERNET,
  ALERT_TITLE_SUBSCRIPTION_RESTORE_ERROR,
  ALERT_TITLE_SUBSCRIPTION_RESTORE_SUCCESS,
  ALERT_TITLE_SUBSCRIPTION_UPGRADE_SUCCESS
} from '../constants/messages';

import { URL_FEEDBACK, URL_MANAGE_APPLE_SUBSCRIPTIONS, URL_PRIVACY_POLICY, URL_TERMS_OF_USE } from '../constants/urls';
import NavigationService from '../navigation/NavigationService';
import { RootState } from '../reducers';
import { validateSubscriptionReceipt } from '../reducers/subscriptions';
import { getUser } from '../reducers/user';
import { selectActiveSubscriptionProductId, selectSubscriptionsError, selectSubscriptionsValidationResult } from '../selectors/subscriptions';
import { selectUserDetails, selectUserHasSubscribedBefore } from '../selectors/user';
import { selectTotalAvailableVoices } from '../selectors/voices';

interface State {
  readonly subscriptions: Array<RNIap.Subscription<string>>;
  readonly isLoadingBuySubscription: boolean;
  readonly isLoadingRestorePurchases: boolean;
  readonly isLoadingSubscriptionItems: boolean;
  readonly isLoadingPurchases: boolean;
  readonly isPurchased: boolean;
  readonly selectedProductId: string;
  readonly purchases: RNIap.Purchase[];
  readonly centeredSubscriptionProductId: string;
}

interface IProps {
  navigation: NavigationScreenProp<NavigationRoute>;
  centeredSubscriptionProductId: string;
}

export interface SubscriptionFeature {
  productId: string;
  title: string;
  price: string | null;
  body: string[];
  footer: string;
}

export type SubscriptionFeatures = SubscriptionFeature[];

export type Props = IProps & StateProps & DispatchProps;

export class UpgradeContainerComponent extends React.PureComponent<Props, State> {

  get analyticsUserId(): string {
    const { userDetails } = this.props;

    if (!userDetails || !userDetails.id) { return '' };

    return userDetails.id;
  }

  get subscriptionFeatures(): SubscriptionFeatures {
    const { totalAvailableVoices } = this.props;

    return [
      {
        productId: 'free',
        title: 'Free',
        price: '0',
        body: ['Basic quality voices', 'One voice option per language', 'Max. 30 minutes per month', 'Fixed playback speed', 'Unlimited playlist items', 'Some advertisements'],
        footer: 'About 5 articles to audio, per month'
      },
      {
        productId: 'com.aardwegmedia.playpost.premium',
        title: 'Premium',
        price: null,
        body: [`${totalAvailableVoices}+ High Quality voices`, 'Multiple voice options per language', 'Max. 120 minutes per month', 'Customize the playback speed', 'Unlimited playlist items', 'No advertisements'],
        footer: 'About 25 articles to audio, per month'
      },
      {
        productId: 'com.aardwegmedia.playpost.subscription.plus',
        title: 'Plus',
        price: null,
        body: [`${totalAvailableVoices}+ High Quality voices`, 'Multiple voice options per language', 'Max. 300 minutes per month', 'Customize the playback speed', 'Unlimited playlist items', 'No advertisements'],
        footer: 'About 65 articles to audio, per month'
      }
    ];
  }

  static contextType = NetworkContext;

  state = {
    subscriptions: [] as Array<RNIap.Subscription<string>>,
    isLoadingBuySubscription: false,
    isLoadingRestorePurchases: false,
    isLoadingSubscriptionItems: false,
    isLoadingPurchases: false,
    isPurchased: false,
    purchases: [] as RNIap.Purchase[],
    selectedProductId: '',
    centeredSubscriptionProductId: ''
  };

  /* tslint:disable-next-line no-any */
  purchaseUpdateSubscription: any = null;

  /* tslint:disable-next-line no-any */
  purchaseErrorSubscription: any = null;

  componentDidMount() {
    const { isConnected } = this.context;

    // For now, just close the screen when there's no active internet connection
    // TODO: make more user friendly to show upgrade features when there's no internet connection
    if (!isConnected) {
      this.handleClose();
      return Alert.alert(ALERT_TITLE_ERROR_NO_INTERNET, ALERT_GENERIC_INTERNET_REQUIRED);
    }

    this.setState({ centeredSubscriptionProductId: this.props.centeredSubscriptionProductId });

    this.fetchAvailableSubscriptionItems(SUBSCRIPTION_PRODUCT_IDS);

    this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase: RNIap.ProductPurchase) => {
      const { selectedProductId } = this.state;

      try {
        // Validatation error is handeled in ErrorAlertContainer
        // The validation result is handled in componentDidUpdate
        await this.props.validateSubscriptionReceipt(selectedProductId, purchase.transactionReceipt);
        Analytics.trackEvent('Subscriptions upgrade success', { Status: 'success', ProductId: purchase.productId, UserId: this.analyticsUserId });
      } finally {
        this.setState({ isLoadingRestorePurchases: false, isLoadingBuySubscription: false, selectedProductId: '' });
      }
    });

    this.purchaseErrorSubscription = RNIap.purchaseErrorListener(async (error: RNIap.PurchaseError) => {
      const errorMessage = error && error.debugMessage ? error.debugMessage : JSON.stringify(error);

      Analytics.trackEvent('Subscriptions upgrade error', {
        Status: 'error',
        Message: errorMessage,
        ProductId: this.state.selectedProductId,
        UserId: this.analyticsUserId
      });

      this.showErrorAlert(
        'Oops!',
        `If you canceled an upgrade, you can ignore this message.\n\nIf you tried to upgrade please contact our support with this error message:\n\n ${errorMessage}`
      );

      this.setState({ isLoadingRestorePurchases: false, isLoadingBuySubscription: false, selectedProductId: '' });
    });

  }

  componentWillUnmount(): void {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }

    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }

    if (Platform.OS === 'android') {
      RNIap.endConnectionAndroid();
    }
  }

  async componentDidUpdate(prevProps: Props): Promise<void> {
    const { isLoadingBuySubscription, isLoadingRestorePurchases } = this.state;
    const { validationResult } = this.props;

    // When we receive an API response when doing an upgrade...
    if (isLoadingBuySubscription && validationResult) {
      if (!isEqual(prevProps.validationResult, validationResult)) {
        Alert.alert(ALERT_TITLE_SUBSCRIPTION_UPGRADE_SUCCESS, ALERT_SUBSCRIPTION_BUY_SUCCESS);

        await this.fetchUpdatedUserData();

        return this.handleClose();
      }
    }

    // When we receive an API response when doing a restore...
    if (isLoadingRestorePurchases && validationResult) {
      // If we try to restore a previous purchase...
      if (!isEqual(prevProps.validationResult, validationResult)) {
        // Error!
        if (validationResult.status !== 'active') {
          return this.showErrorAlert(
            ALERT_TITLE_SUBSCRIPTION_RESTORE_ERROR,
            `Your previous subscription is ${validationResult.status}. In order to use our Premium features, you need to buy a new subscription.`
          );
        }

        // Success!
        Alert.alert(ALERT_TITLE_SUBSCRIPTION_RESTORE_SUCCESS, ALERT_SUBSCRIPTION_RESTORE_SUCCESS);

        await this.fetchUpdatedUserData();

        return this.handleClose();
      }
    }
  }

  fetchUpdatedUserData = async () => {
    try {
      // Get the user with up-to-date data about his account
      const result = await this.props.getUser();
      return result;
    } catch (err) {
      const errorMessage =
        err && err.message ? err.message : 'An unknown error happened while getting the up-to-date user account data after upgrade or restore.';
      Analytics.trackEvent('Subscriptions fetch updated user data error', {
        Status: 'error',
        Message: errorMessage,
        ProductId: this.state.selectedProductId,
        UserId: this.analyticsUserId
      });
      return err;
    }
  }

  handleClose = async () => {
    // Normally we should put this in componentWillUnmount
    // But, since the upgrade screen is part of React Navigation, unmount is not called in this context
    // So we manually handle the removal of event listeners
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }

    // Close the modal
    NavigationService.goBack({ key: null });
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
        onPress: () => NavigationService.navigate('Browser', { url: URL_FEEDBACK, title: 'Support' })
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
    let manageSubscriptionsButton: object = {
      text: 'Manage Subscriptions',
      onPress: () => {
        Analytics.trackEvent('Subscriptions manage press', { ProductId: this.state.selectedProductId, UserId: this.analyticsUserId });
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
    // If it's a downgrade to an other paid subscription
    if (this.isDowngradePaidSubscription(productId)) {
      Analytics.trackEvent('Subscriptions downgrade', { Status: 'alert', ProductId: productId, UserId: this.analyticsUserId });

      return this.showManageSubscriptionAlert(
        'Downgrading Subscription?',
        'Downgrading a subscription can only be done through iTunes.\n\n Press "Manage Subscriptions" below to manage your subscriptions.'
      );
    }

    // If it's a downgrade to "free"
    if (this.isDowngradeFreeSubscription(productId)) {
      Analytics.trackEvent('Subscriptions downgrade', { Status: 'alert', ProductId: productId, UserId: this.analyticsUserId });

      return this.showManageSubscriptionAlert(
        'Downgrade to Free?',
        'To downgrade to Free you need to cancel your current subscription. Cancelling a subscription can only be done through iTunes.\n\n Press "Manage Subscriptions" below to manage your subscriptions.'
      );
    }

    Analytics.trackEvent('Subscriptions upgrade', { Status: 'upgrading', ProductId: productId, UserId: this.analyticsUserId });

    return this.setState({ isLoadingBuySubscription: true, selectedProductId: productId, centeredSubscriptionProductId: productId }, async () => {
      try {
        const upgradeResult = await this.buySubscription(productId);
        return upgradeResult;
      } catch (err) {
        // We don't do anything with this message, as errors are handled by: purchaseErrorListener

        return err;
      }
    });
  }

  buySubscription = (productId: string): Promise<string> => {
    return RNIap.requestSubscription(productId);
  }

  isDowngradePaidSubscription = (productId: string): boolean => {
    const { activeSubscriptionProductId } = this.props;
    const { subscriptions } = this.state;

    const subscriptionToUpgradeTo = subscriptions.find(subscription => subscription.productId === productId);
    const currentSubscription = subscriptions.find(subscription => subscription.productId === activeSubscriptionProductId);

    if (!subscriptionToUpgradeTo) { return false; }
    if (!currentSubscription) { return false; }

    return Number(subscriptionToUpgradeTo.price) < Number(currentSubscription.price);
  }

  isDowngradeFreeSubscription = (productId: string): boolean => {
    const { activeSubscriptionProductId } = this.props;
    return productId === 'free' && activeSubscriptionProductId !== 'free';
  }

  handleOnPressRestore = async () => {
    Analytics.trackEvent('Subscriptions restore', { Status: 'restoring', UserId: this.analyticsUserId });

    return this.setState({ isLoadingRestorePurchases: true }, async () => {
      try {
        // Get the previous purchases of the current user
        const purchases = await this.getAvailablePurchases();

        // Get the latest receipt from the purchases to validate
        const { transactionReceipt, productId } = this.getLatestPurchase(purchases);

        // Validate the receipt on our server
        await this.props.validateSubscriptionReceipt(productId, transactionReceipt);

        Analytics.trackEvent('Subscriptions restore success', { Status: 'success', ProductId: productId, UserId: this.analyticsUserId });

        // The validation result is handled in componentDidUpdate
      } catch (err) {
        const errorMessage = err && err.message ? err.message : 'An unknown error happened while restoring a subscription.';
        Analytics.trackEvent('Subscriptions restore error', { Status: 'error', Message: errorMessage, UserId: this.analyticsUserId });

        this.showErrorAlert(ALERT_TITLE_SUBSCRIPTION_RESTORE_ERROR, errorMessage);
      } finally {
        this.setState({ isLoadingRestorePurchases: false });
      }
    });
  }

  getAvailablePurchases = (): Promise<RNIap.Purchase[]> => {
    return new Promise(async (resolve, reject) => {
      this.setState({ isLoadingPurchases: true }, async () => {
        try {
          const purchases = await RNIap.getAvailablePurchases();
          resolve(purchases);
        } catch (err) {
          reject(err);
        } finally {
          this.setState({ isLoadingPurchases: false })
        }
      });
    });
  }

  fetchAvailableSubscriptionItems = async (subscriptionProductIds: string[]) => {
    return this.setState({ isLoadingSubscriptionItems: true }, async () => {
      try {
        const result = await RNIap.initConnection();

        if (Platform.OS === 'android') {
          await RNIap.consumeAllItemsAndroid();
        }

        await this.getAvailablePurchases();

        if (!result) { throw new Error(ALERT_SUBSCRIPTION_INIT_FAIL); }

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

  /**
   * A method to check if a user has previously already used a subscription,
   * if so, it is not eligible for a trial and we should not show "Start free trial" button
   *
   * Technically this is already handled by Apple so a user cannot start a trial twice
   */
  get isEligibleForTrial() {
    const { userHasSubscribedBefore } = this.props;

    return !userHasSubscribedBefore;
  }

  render() {
    const { isLoadingRestorePurchases, isLoadingBuySubscription, isLoadingSubscriptionItems, subscriptions, centeredSubscriptionProductId } = this.state;
    const { activeSubscriptionProductId } = this.props;

    return (
      <Upgrade
        isLoadingSubscriptionItems={isLoadingSubscriptionItems}
        isLoadingBuySubscription={isLoadingBuySubscription}
        isLoadingRestorePurchases={isLoadingRestorePurchases}
        isEligibleForTrial={this.isEligibleForTrial}
        subscriptions={subscriptions}
        activeSubscriptionProductId={activeSubscriptionProductId}
        centeredSubscriptionProductId={centeredSubscriptionProductId}
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
  totalAvailableVoices: ReturnType<typeof selectTotalAvailableVoices>;
  userHasSubscribedBefore: ReturnType<typeof selectUserHasSubscribedBefore>;
}

interface DispatchProps {
  validateSubscriptionReceipt: typeof validateSubscriptionReceipt;
  getUser: typeof getUser;
}

const mapStateToProps = (state: RootState): StateProps => ({
  subscriptionsError: selectSubscriptionsError(state),
  validationResult: selectSubscriptionsValidationResult(state),
  activeSubscriptionProductId: selectActiveSubscriptionProductId(state),
  userDetails: selectUserDetails(state),
  totalAvailableVoices: selectTotalAvailableVoices(state),
  userHasSubscribedBefore: selectUserHasSubscribedBefore(state)
});

const mapDispatchToProps = {
  validateSubscriptionReceipt,
  getUser
};

export const UpgradeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UpgradeContainerComponent);
