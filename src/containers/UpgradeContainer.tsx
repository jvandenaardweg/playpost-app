import Analytics from 'appcenter-analytics';
import React from 'react';
import { Alert, Linking, Platform } from 'react-native';
import RNIap from 'react-native-iap';
import { NavigationRoute, NavigationScreenProp } from 'react-navigation';
import { connect } from 'react-redux';

import { Upgrade } from '../components/Upgrade';

import { NetworkContext } from '../contexts/NetworkProvider';
import NavigationService from '../navigation/NavigationService';

import { SUBSCRIPTION_PRODUCT_ID_FREE, SUBSCRIPTION_PRODUCT_ID_PLUS, SUBSCRIPTION_PRODUCT_ID_PREMIUM, SUBSCRIPTION_PRODUCT_IDS } from '../constants/in-app-purchase';
import {
  ALERT_GENERIC_INTERNET_REQUIRED,
  ALERT_SUBSCRIPTION_INIT_FAIL,
  ALERT_SUBSCRIPTION_RESTORE_PURCHASE_NOT_FOUND,
  ALERT_TITLE_ERROR_NO_INTERNET,
  ALERT_TITLE_SUBSCRIPTION_RESTORE_ERROR} from '../constants/messages';
import {
  URL_FEEDBACK,
  URL_MANAGE_APPLE_SUBSCRIPTIONS,
  URL_MANAGE_GOOGLE_SUBSCRIPTIONS,
  URL_PRIVACY_POLICY,
  URL_TERMS_OF_USE
} from '../constants/urls';
import { RootState } from '../reducers';
import { setIsLoadingRestore, setIsLoadingUpgrade, validateSubscriptionReceipt } from '../reducers/subscriptions';
import { getUser } from '../reducers/user';
import { selectActiveSubscriptionProductId, selectIsSubscribed, selectSubscriptionsError, selectSubscriptionsIsLoadingRestore, selectSubscriptionsIsLoadingUpgrade, selectSubscriptionsValidationResult } from '../selectors/subscriptions';
import { selectUserDetails, selectUserHasSubscribedBefore } from '../selectors/user';
import { selectTotalAvailableVoices } from '../selectors/voices';
import * as inAppPurchaseHelper from '../utils/in-app-purchase-helper';

interface State {
  readonly subscriptions: Array<RNIap.Subscription<string>>;
  readonly isLoadingSubscriptionItems: boolean;
  readonly isLoadingPurchases: boolean;
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
        productId: SUBSCRIPTION_PRODUCT_ID_FREE,
        title: 'Free',
        price: '0',
        body: ['Basic quality voices', 'One voice option per language', 'Max. 30 minutes per month', 'Unlimited playlist items', 'Some advertisements'],
        footer: 'About 5 articles to audio, per month'
      },
      {
        productId: SUBSCRIPTION_PRODUCT_ID_PREMIUM,
        title: 'Premium',
        price: null,
        body: [`${totalAvailableVoices}+ High Quality voices`, 'Multiple voice options per language', 'Max. 120 minutes per month', 'Unlimited playlist items', 'No advertisements'],
        footer: 'About 25 articles to audio, per month'
      },
      {
        productId: SUBSCRIPTION_PRODUCT_ID_PLUS,
        title: 'Plus',
        price: null,
        body: [`${totalAvailableVoices}+ High Quality voices`, 'Multiple voice options per language', 'Max. 300 minutes per month', 'Unlimited playlist items', 'No advertisements'],
        footer: 'About 65 articles to audio, per month'
      }
    ];
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

  static contextType = NetworkContext;

  state = {
    subscriptions: [] as Array<RNIap.Subscription<string>>,
    isLoadingSubscriptionItems: false,
    isLoadingPurchases: false,
    purchases: [] as RNIap.Purchase[],
    centeredSubscriptionProductId: ''
  };

  async componentDidMount() {
    const { isConnected } = this.context;

    // For now, just close the screen when there's no active internet connection
    // TODO: make more user friendly to show upgrade features when there's no internet connection
    if (!isConnected) {
      this.handleClose();
      return Alert.alert(ALERT_TITLE_ERROR_NO_INTERNET, ALERT_GENERIC_INTERNET_REQUIRED);
    }

    this.getAvailableSubscriptionItems(SUBSCRIPTION_PRODUCT_IDS);
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
        ProductId: this.state.centeredSubscriptionProductId,
        UserId: this.analyticsUserId
      });
      return err;
    }
  }

  handleClose = async () => {
    // Close the modal
    NavigationService.goBack({ key: null });
  }

  handleOpenPrivacy = () => Linking.openURL(`${URL_PRIVACY_POLICY}?ref=playpost://upgrade`);

  handleOpenTerms = () => Linking.openURL(`${URL_TERMS_OF_USE}?ref=playpost://upgrade`);

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
    const manageSubscriptionsUrl = Platform.OS === 'ios' ? URL_MANAGE_APPLE_SUBSCRIPTIONS : `${URL_MANAGE_GOOGLE_SUBSCRIPTIONS}&sku=${this.state.centeredSubscriptionProductId}`;

    return Alert.alert(title, message, [
      {
        text: 'Manage Subscriptions',
        onPress: () => {
          Analytics.trackEvent('Subscriptions manage press', { ProductId: this.state.centeredSubscriptionProductId, UserId: this.analyticsUserId });
          Linking.openURL(manageSubscriptionsUrl);
        }
      },
      {
        text: 'OK',
        style: 'cancel'
      }
    ]);
  }

  handleOnPressUpgrade = async (productId: string) => {
    const storeName = Platform.OS === 'ios' ? 'iTunes' : 'Google Play';

    // If it's a downgrade to an other paid subscription
    if (this.isDowngradePaidSubscription(productId)) {
      Analytics.trackEvent('Subscriptions downgrade', { Status: 'alert', ProductId: productId, UserId: this.analyticsUserId });

      return this.showManageSubscriptionAlert(
        'Downgrading Subscription?',
        `Downgrading a subscription can only be done through ${storeName}.\n\n Press "Manage Subscriptions" below to manage your subscriptions.`
      );
    }

    // If it's a downgrade to "free"
    if (this.isDowngradeFreeSubscription(productId)) {
      Analytics.trackEvent('Subscriptions downgrade', { Status: 'alert', ProductId: productId, UserId: this.analyticsUserId });

      return this.showManageSubscriptionAlert(
        'Downgrade to Free?',
        `To downgrade to Free you need to cancel your current subscription. Cancelling a subscription can only be done through ${storeName}.\n\n Press "Manage Subscriptions" below to manage your subscriptions.`
      );
    }

    this.props.setIsLoadingUpgrade(true);

    Analytics.trackEvent('Subscriptions upgrade', { Status: 'upgrading', ProductId: productId, UserId: this.analyticsUserId });

    this.setState({ centeredSubscriptionProductId: productId }, async () => {
      try {
        const upgradeResult = await this.requestSubscription(productId);

        // The result of requestSubscription is handled in SubscriptionHandlerContainer
        return upgradeResult;
      } catch (err) {
        const errorMessage = err && err.message ? err.message : 'An unknown error happened while upgrading a subscription.';
        Analytics.trackEvent('Subscriptions upgrade error', { Status: 'error', Message: errorMessage, UserId: this.analyticsUserId });

        return this.props.setIsLoadingUpgrade(false);

        // An error with requestSubscription is handled in SubscriptionHandlerContainer on handlePurchaseErrorListener
        // return this.showErrorAlert(ALERT_TITLE_SUBSCRIPTION_UPGRADE_ERROR, errorMessage);
      }
    })
  }

  handleOnPressRestore = async () => {
    this.props.setIsLoadingRestore(true);

    try {
      Analytics.trackEvent('Subscriptions restore', { Status: 'restoring', UserId: this.analyticsUserId });

      // Get the previous purchases of the current user
      const purchases = await this.getAvailablePurchases();

      // If there are no previous purchases, there's nothing to restore...
      if (!purchases || !purchases.length) {
        this.props.setIsLoadingRestore(false);
        Analytics.trackEvent('Subscriptions restore nothing', { Status: 'nothing', UserId: this.analyticsUserId });
        return this.showErrorAlert(`Nothing to restore`, `We could not find any previous purchase to restore. If you think this is incorrect, please contact our support.`);
      }

      // If we end up here, the user has previous purchases in our app.
      // Let's get the latest purchase receipt and validate that on the server

      // Get the latest receipt from the purchases to validate
      const purchase = this.getLatestPurchase(purchases);

      if (Platform.OS === 'ios') {
        if (!purchase.transactionId) {
          throw new Error('transactionId is not found in latest purchase.');
        }
      }

      if (Platform.OS === 'android') {
        if (!purchase.purchaseToken) {
          throw new Error('purchaseToken is not found in latest purchase.');
        }
      }

      // Validate the receipt on our server
      await this.props.validateSubscriptionReceipt(purchase.productId, purchase.transactionReceipt, Platform.OS);

      // Finish the transaction, if it was not finished yet
      await this.finishSubscriptionTransaction(purchase);

      // The validation result is handled in SubscriptionHandlerContainer
    } catch (err) {
      const errorMessage = err && err.message ? err.message : 'An unknown error happened while restoring a subscription.';
      Analytics.trackEvent('Subscriptions restore error', { Status: 'error', Message: errorMessage, UserId: this.analyticsUserId });

      this.props.setIsLoadingRestore(false);

      this.showErrorAlert(ALERT_TITLE_SUBSCRIPTION_RESTORE_ERROR, errorMessage);
    }
  }

  finishSubscriptionTransaction = async (purchase: RNIap.ProductPurchase) => {
    return inAppPurchaseHelper.finishSubscriptionTransaction(purchase)
  }

  requestSubscription = (productId: string): Promise<string> => {
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
    return productId === SUBSCRIPTION_PRODUCT_ID_FREE && activeSubscriptionProductId !== SUBSCRIPTION_PRODUCT_ID_FREE;
  }

  getPurchaseHistory = (): Promise<RNIap.Purchase[]> => {
    return RNIap.getPurchaseHistory();
  }

  getAvailablePurchases = (): Promise<RNIap.Purchase[]> => {
    return RNIap.getAvailablePurchases();
  }

  getAvailableSubscriptionItems = async (subscriptionProductIds: string[]) => {
    const { centeredSubscriptionProductId } = this.props;

    return this.setState({ centeredSubscriptionProductId, isLoadingSubscriptionItems: true }, async () => {
      try {
        const result = await RNIap.initConnection();

        if (!result) {
          throw new Error(ALERT_SUBSCRIPTION_INIT_FAIL);
        }

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
    // https://github.com/dooboolab/react-native-iap/issues/532#issuecomment-503174711
    const sortedPurchases = purchases.sort((a, b) => b.transactionDate - a.transactionDate);

    // Find the latest purchase based on the subscription productId
    const purchase = sortedPurchases[0];

    if (!purchase) {
      throw new Error(
        'We could not find a purchase to restore inside your previous purchases.\n\n If you had a subscription before, it might be expired. If you think this is incorrect, contact our support or e-mail at info@playpost.app.'
      );
    }

    return purchase;
  }

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

  render() {
    const { isLoadingSubscriptionItems, subscriptions, centeredSubscriptionProductId } = this.state;
    const { activeSubscriptionProductId, isLoadingUpgrade, isLoadingRestore } = this.props;

    return (
      <Upgrade
        isLoadingSubscriptionItems={isLoadingSubscriptionItems}
        isLoadingBuySubscription={isLoadingUpgrade}
        isLoadingRestorePurchases={isLoadingRestore}
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
  isSubscribed: ReturnType<typeof selectIsSubscribed>;
  activeSubscriptionProductId: ReturnType<typeof selectActiveSubscriptionProductId>;
  userDetails: ReturnType<typeof selectUserDetails>;
  totalAvailableVoices: ReturnType<typeof selectTotalAvailableVoices>;
  userHasSubscribedBefore: ReturnType<typeof selectUserHasSubscribedBefore>;
  isLoadingUpgrade: ReturnType<typeof selectSubscriptionsIsLoadingUpgrade>;
  isLoadingRestore: ReturnType<typeof selectSubscriptionsIsLoadingRestore>;
}

interface DispatchProps {
  validateSubscriptionReceipt: typeof validateSubscriptionReceipt;
  getUser: typeof getUser;
  setIsLoadingUpgrade: typeof setIsLoadingUpgrade;
  setIsLoadingRestore: typeof setIsLoadingRestore;
}

const mapStateToProps = (state: RootState): StateProps => ({
  subscriptionsError: selectSubscriptionsError(state),
  validationResult: selectSubscriptionsValidationResult(state),
  isSubscribed: selectIsSubscribed(state),
  activeSubscriptionProductId: selectActiveSubscriptionProductId(state),
  userDetails: selectUserDetails(state),
  totalAvailableVoices: selectTotalAvailableVoices(state),
  userHasSubscribedBefore: selectUserHasSubscribedBefore(state),
  isLoadingUpgrade: selectSubscriptionsIsLoadingUpgrade(state),
  isLoadingRestore: selectSubscriptionsIsLoadingRestore(state),
});

const mapDispatchToProps = {
  validateSubscriptionReceipt,
  getUser,
  setIsLoadingUpgrade,
  setIsLoadingRestore
};

export const UpgradeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UpgradeContainerComponent);
