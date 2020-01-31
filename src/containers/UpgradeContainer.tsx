import analytics from '@react-native-firebase/analytics';
import React from 'react';
import { Alert, Linking, Platform } from 'react-native';
import * as RNIap from 'react-native-iap';
import { NavigationRoute, NavigationScreenProp } from 'react-navigation';
import { connect } from 'react-redux';

import { Upgrade } from '../components/Upgrade';
import * as inAppBrowser from '../utils/in-app-browser';

import { NetworkContext } from '../contexts/NetworkProvider';
import NavigationService from '../navigation/NavigationService';

import { SUBSCRIPTION_PRODUCT_ID_FREE, SUBSCRIPTION_PRODUCT_ID_PLUS, SUBSCRIPTION_PRODUCT_ID_PREMIUM, SUBSCRIPTION_PRODUCT_ID_UNLIMITED, SUBSCRIPTION_PRODUCT_IDS } from '../constants/in-app-purchase';
import {
  ALERT_GENERIC_INTERNET_REQUIRED,
  ALERT_SUBSCRIPTION_INIT_FAIL,
  ALERT_SUBSCRIPTION_RESTORE_PLATFORM_ANDROID,
  ALERT_SUBSCRIPTION_RESTORE_PLATFORM_IOS,
  ALERT_SUBSCRIPTION_RESTORE_PURCHASE_NOT_FOUND,
  ALERT_SUBSCRIPTION_UPGRADE_PLATFORM_ANDROID,
  ALERT_SUBSCRIPTION_UPGRADE_PLATFORM_IOS,
  ALERT_TITLE_ERROR,
  ALERT_TITLE_ERROR_NO_INTERNET,
  ALERT_TITLE_SUBSCRIPTION_RESTORE_ERROR} from '../constants/messages';
import {
  URL_FEEDBACK,
  URL_MANAGE_APPLE_SUBSCRIPTIONS,
  URL_MANAGE_GOOGLE_SUBSCRIPTIONS} from '../constants/urls';
import { RootState } from '../reducers';
import { getInAppSubscriptions, setIsLoadingRestore, setIsLoadingUpgrade, setLocalPurchaseHistory } from '../reducers/subscriptions';
import { getUser, UserTheme } from '../reducers/user';
import { selectAvailableInAppSubscriptions, selectSubscriptionsError, selectSubscriptionsIsLoadingRestore, selectSubscriptionsIsLoadingUpgrade, selectSubscriptionsValidationResult } from '../selectors/subscriptions';
import { selectActiveUserInAppSubscription, selectUserActiveSubscriptionProductId, selectUserDetails, selectUserIsEligibleForTrial, selectUserIsSubscribed } from '../selectors/user';
import { selectTotalAvailableUnsubscribedVoices, selectTotalAvailableVoices } from '../selectors/voices';
import * as inAppPurchaseHelper from '../utils/in-app-purchase-helper';

interface State {
  readonly subscriptions: RNIap.Subscription[];
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
  title: string;
  price: number; // just a placeholder
  body: string[];
  footer: string;
}

export interface SubscriptionFeatures {
  [productId: string]: SubscriptionFeature;
}

export type Props = IProps & StateProps & DispatchProps;

export class UpgradeContainerComponent extends React.PureComponent<Props, State> {
  get subscriptionFeatures(): SubscriptionFeatures {
    const { totalAvailableVoices, totalAvailableUnsubscribedVoices, availableInAppSubscriptions } = this.props;

    const features = {
      [SUBSCRIPTION_PRODUCT_ID_FREE]: {
        title: 'Free',
        price: 0,
        body: [
          `Access to ${totalAvailableUnsubscribedVoices} of ${totalAvailableVoices} voices`,
          'Use basic quality voices',
          'One predefined voice per language',
          'Max. 30 minutes per month',
          'Unlimited playlist items',
          'Some advertisements'
        ],
        footer: 'First 30 minutes High Quality voice\nfor free'
      },
      [SUBSCRIPTION_PRODUCT_ID_PREMIUM]: {
        title: 'Premium',
        price: 0,
        body: [
          `Access to all ${totalAvailableVoices} voices`,
          'Use the highest quality voices',
          'Change the voice per language',
          'Max. 120 minutes per month',
          'Unlimited playlist items',
          'No advertisements'
        ],
        footer: '\n'
      },
      [SUBSCRIPTION_PRODUCT_ID_PLUS]: {
        title: 'Plus',
        price: 0,
        body: [
          `Access to all ${totalAvailableVoices} voices`,
          'Use the highest quality voices',
          'Change the voice per language',
          'Max. 300 minutes per month',
          'Unlimited playlist items',
          'No advertisements'
        ],
        footer: 'Same as Premium,\nbut with more minutes.'
      },
      [SUBSCRIPTION_PRODUCT_ID_UNLIMITED]: {
        title: 'Unlimited',
        price: 0,
        body: [
          `Access to all ${totalAvailableVoices} voices`,
          'Use the highest quality voices',
          'Change the voice per language',
          'Unlimited minutes per month',
          'Unlimited playlist items',
          'No advertisements'
        ],
        footer: 'Same as Premium,\nbut with unlimited minutes.'
      }
    }

    const productIds = Object.keys(features)
    const availableProductIds = availableInAppSubscriptions.map(availableInAppSubscription => availableInAppSubscription.productId);

    // Only show the active subscriptions
    productIds.map(productId => {
      if (!availableProductIds.includes(productId)) {
        delete features[productId];
      }
    })

    return features;
  }

  static contextType = NetworkContext;

  state = {
    subscriptions: [] as RNIap.Subscription[],
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

    this.props.getInAppSubscriptions();
    this.props.getUser();

    this.getAvailableSubscriptionItems(SUBSCRIPTION_PRODUCT_IDS);

    // Stores the local purchases from the user's device into our local store
    // So we can determine if the user already used a trial
    this.addLocalPurchasesToStore()
  }

  addLocalPurchasesToStore = async () => {
    const purchaseHistory = await RNIap.getPurchaseHistory()
    this.props.setLocalPurchaseHistory(purchaseHistory)
  }

  fetchUpdatedUserData = async () => {
    try {
      // Get the user with up-to-date data about his account
      const result = await this.props.getUser();
      return result;
    } catch (err) {
      const errorMessage = err && err.message ? err.message : 'An unknown error happened while getting the up-to-date user account data after upgrade or restore.';
      return errorMessage;
    }
  }

  handleClose = async () => {
    // Close the modal
    NavigationService.goBack({ key: null });
  }

  handleOnPressOpenUrl = (url: string) => inAppBrowser.openUrl(`${url}?ref=playpost://upgrade`, UserTheme.light);

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
        onPress: async () => {
          await analytics().logEvent('subscription_press_manage', {
            productId: this.state.centeredSubscriptionProductId
          });

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
    const { activeInAppSubscription } = this.props;
    const storeName = Platform.OS === 'ios' ? 'iTunes' : 'Google Play';
    const isDowngrade = this.isDowngradePaidSubscription(productId);
    const activeInAppSubscriptionProductId = (activeInAppSubscription) ? activeInAppSubscription.inAppSubscription.productId : '';
    const activeInAppSubscriptionService = (activeInAppSubscription) ? activeInAppSubscription.inAppSubscription.service : '';

    // Prevent upgrading when there's already an active subscription, on an other platform

    // Active subscription is an subscription bought with the Android app
    // Only allow upgrading through the Android app. Or cancel the Android subscription.
    if (Platform.OS === 'ios' && !this.isSubscriptionActiveOnCurrentPlatform) {
      return this.showErrorAlert(ALERT_TITLE_ERROR, ALERT_SUBSCRIPTION_UPGRADE_PLATFORM_ANDROID);
    }

    if (Platform.OS === 'android' && !this.isSubscriptionActiveOnCurrentPlatform) {
      return this.showErrorAlert(ALERT_TITLE_ERROR, ALERT_SUBSCRIPTION_UPGRADE_PLATFORM_IOS);
    }

    // If it's a downgrade to an other paid subscription, and we are on iOS
    // Just show a user can only downgrade through iTunes
    if (isDowngrade && Platform.OS === 'ios') {
      await analytics().logEvent('subscription_press_downgrade', {
        productId
      });

      return this.showManageSubscriptionAlert(
        'Downgrading Subscription?',
        `Downgrading a subscription can only be done through ${storeName}.\n\n Press "Manage Subscriptions" below to manage your subscriptions.`
      );
    }

    // If it's a downgrade to "free"
    if (this.isDowngradeFreeSubscription(productId)) {
      await analytics().logEvent('subscription_press_downgrade', {
        productId
      });

      return this.showManageSubscriptionAlert(
        'Downgrade to Free?',
        `To downgrade to Free you need to cancel your current subscription. Cancelling a subscription can only be done through ${storeName}.\n\n Press "Manage Subscriptions" below to manage your subscriptions.`
      );
    }

    this.setState({ centeredSubscriptionProductId: productId });

    await analytics().logEvent('subscription_press_upgrade', {
      productId
    });

    this.props.setIsLoadingUpgrade(true);

    try {
      await this.requestSubscription(productId, activeInAppSubscriptionProductId, activeInAppSubscriptionService);
    } catch (err) {
      return this.props.setIsLoadingUpgrade(false);

      // An error with requestSubscription is handled in SubscriptionHandlerContainer on handlePurchaseErrorListener
      // return this.showErrorAlert(ALERT_TITLE_SUBSCRIPTION_UPGRADE_ERROR, errorMessage);
    }
  }

  handleOnPressRestore = async () => {
    const { centeredSubscriptionProductId } = this.props;

    await analytics().logEvent('subscription_press_restore', {
      productId: centeredSubscriptionProductId
    });

    // Prevent restoring when there's an active subscription on an other platform

    if (Platform.OS === 'android' && !this.isSubscriptionActiveOnCurrentPlatform) {
      return this.showErrorAlert(ALERT_TITLE_ERROR, ALERT_SUBSCRIPTION_RESTORE_PLATFORM_ANDROID);
    }

    if (Platform.OS === 'ios' && !this.isSubscriptionActiveOnCurrentPlatform) {
      return this.showErrorAlert(ALERT_TITLE_ERROR, ALERT_SUBSCRIPTION_RESTORE_PLATFORM_IOS);
    }

    // Only when the user has no active subscriptions on an other platform, we do the restore purchase flow

    this.props.setIsLoadingRestore(true);

    try {
      // Get the previous purchases of the current user
      const purchases = await this.getAvailablePurchases();

      // If there are no previous purchases, there's nothing to restore...
      if (!purchases || !purchases.length) {
        this.props.setIsLoadingRestore(false);

        await analytics().logEvent('subscription_press_restore_nothing', {
          productId: centeredSubscriptionProductId
        });

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

      // Get the updated user with the active subscription
      await this.props.getUser();

      // Finish the transaction, if it was not finished yet
      await this.finishSubscriptionTransaction(purchase);

      this.props.setIsLoadingRestore(false);

      // The validation result is handled in SubscriptionHandlerContainer
    } catch (err) {
      const errorMessage = err && err.message ? err.message : 'An unknown error happened while restoring a subscription.';

      this.props.setIsLoadingRestore(false);

      this.showErrorAlert(ALERT_TITLE_SUBSCRIPTION_RESTORE_ERROR, errorMessage);
    }
  }

  finishSubscriptionTransaction = async (purchase: RNIap.SubscriptionPurchase): Promise<void | string | RNIap.PurchaseResult> => {
    return inAppPurchaseHelper.finishSubscriptionTransaction(purchase)
  }

  requestSubscription = (productId: string, activeInAppSubscriptionProductId: Api.InAppSubscription['productId'], activeInAppSubscriptionService: Api.InAppSubscription['service']): Promise<RNIap.SubscriptionPurchase> => {
    return inAppPurchaseHelper.requestSubscription(productId, activeInAppSubscriptionProductId, activeInAppSubscriptionService);
  }

  isDowngradePaidSubscription = (productId: string): boolean => {
    const { activeInAppSubscription } = this.props;
    const { subscriptions } = this.state;

    const subscriptionToUpgradeTo = subscriptions.find(subscription => subscription.productId === productId);

    if (!subscriptionToUpgradeTo) { return false; }
    if (!activeInAppSubscription) { return false; }

    return Number(subscriptionToUpgradeTo.price) < Number(activeInAppSubscription.inAppSubscription.price);
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
        // TODO: remove casting when merged: https://github.com/dooboolab/react-native-iap/pull/746
        const subscriptions = await RNIap.getSubscriptions(subscriptionProductIds) as unknown as RNIap.Subscription[];

        // Re-order the subscriptions
        // const cheapestSubscriptionFirst = subscriptions.sort((a, b) => Number(a.price) - Number(b.price));

        return this.setState({ subscriptions, isLoadingSubscriptionItems: false }, () => subscriptions);
      } catch (err) {
        const errorMessage = err && err.message ? err.message : 'An unknown error happened while fetching the available subscriptions';

        return this.setState({ isLoadingSubscriptionItems: false }, () => {
          return this.showErrorAlert(ALERT_TITLE_ERROR, errorMessage);
        });
      }
    });
  }

  getLatestPurchase = (purchases: RNIap.SubscriptionPurchase[]): RNIap.SubscriptionPurchase => {
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
    const { userDetails } = this.props;

    let feedbackUrl = URL_FEEDBACK;

    if (userDetails) {
      feedbackUrl = feedbackUrl + `?email=${userDetails.email}&id=${userDetails.id}`;
    }

    return Alert.alert(title, message, [
      {
        text: 'Close',
        style: 'cancel'
      },
      {
        text: 'Contact support',
        onPress: () => inAppBrowser.openUrl(feedbackUrl, UserTheme.light, { modalEnabled: false })
      }
    ]);
  }

  get isSubscriptionActiveOnCurrentPlatform(): boolean {
    const { activeInAppSubscription } = this.props;

    // If there is no active subscription, just return true
    if (!activeInAppSubscription) {
      return true;
    }

    const platformToServiceMapping = {
      ios: 'apple',
      android: 'google'
    }

    const currentService = platformToServiceMapping[Platform.OS]

    const activeSubscriptionService = activeInAppSubscription && activeInAppSubscription.inAppSubscription.service

    return activeSubscriptionService === currentService
  }

  render() {
    const { isLoadingSubscriptionItems, subscriptions, centeredSubscriptionProductId } = this.state;
    const { activeSubscriptionProductId, isLoadingUpgrade, isLoadingRestore, userIsEligibleForTrial } = this.props;

    return (
      <Upgrade
        isLoadingSubscriptionItems={isLoadingSubscriptionItems}
        isLoadingBuySubscription={isLoadingUpgrade}
        isLoadingRestorePurchases={isLoadingRestore}
        isEligibleForTrial={userIsEligibleForTrial}
        subscriptions={subscriptions}
        activeSubscriptionProductId={activeSubscriptionProductId}
        centeredSubscriptionProductId={centeredSubscriptionProductId}
        subscriptionFeatures={this.subscriptionFeatures}
        onPressUpgrade={this.handleOnPressUpgrade}
        onPressRestore={this.handleOnPressRestore}
        onPressOpenUrl={this.handleOnPressOpenUrl}
        onPressCancel={this.handleOnPressCancel}
        isDowngradePaidSubscription={this.isDowngradePaidSubscription}
      />
    );
  }
}

interface StateProps {
  subscriptionsError: ReturnType<typeof selectSubscriptionsError>;
  validationResult: ReturnType<typeof selectSubscriptionsValidationResult>;
  isSubscribed: ReturnType<typeof selectUserIsSubscribed>;
  activeSubscriptionProductId: ReturnType<typeof selectUserActiveSubscriptionProductId>;
  userDetails: ReturnType<typeof selectUserDetails>;
  totalAvailableVoices: ReturnType<typeof selectTotalAvailableVoices>;
  userIsEligibleForTrial: ReturnType<typeof selectUserIsEligibleForTrial>;
  isLoadingUpgrade: ReturnType<typeof selectSubscriptionsIsLoadingUpgrade>;
  isLoadingRestore: ReturnType<typeof selectSubscriptionsIsLoadingRestore>;
  activeInAppSubscription: ReturnType<typeof selectActiveUserInAppSubscription>;
  totalAvailableUnsubscribedVoices: ReturnType<typeof selectTotalAvailableUnsubscribedVoices>;
  availableInAppSubscriptions: ReturnType<typeof selectAvailableInAppSubscriptions>;
}

interface DispatchProps {
  getUser: typeof getUser;
  setIsLoadingUpgrade: typeof setIsLoadingUpgrade;
  setIsLoadingRestore: typeof setIsLoadingRestore;
  getInAppSubscriptions: typeof getInAppSubscriptions;
  setLocalPurchaseHistory: typeof setLocalPurchaseHistory;
}

const mapStateToProps = (state: RootState): StateProps => ({
  subscriptionsError: selectSubscriptionsError(state),
  validationResult: selectSubscriptionsValidationResult(state),
  isSubscribed: selectUserIsSubscribed(state),
  activeSubscriptionProductId: selectUserActiveSubscriptionProductId(state),
  userDetails: selectUserDetails(state),
  totalAvailableVoices: selectTotalAvailableVoices(state),
  userIsEligibleForTrial: selectUserIsEligibleForTrial(state),
  isLoadingUpgrade: selectSubscriptionsIsLoadingUpgrade(state),
  isLoadingRestore: selectSubscriptionsIsLoadingRestore(state),
  activeInAppSubscription: selectActiveUserInAppSubscription(state),
  totalAvailableUnsubscribedVoices: selectTotalAvailableUnsubscribedVoices(state),
  availableInAppSubscriptions: selectAvailableInAppSubscriptions(state)
});

const mapDispatchToProps = {
  getUser,
  setIsLoadingUpgrade,
  setIsLoadingRestore,
  getInAppSubscriptions,
  setLocalPurchaseHistory
};

export const UpgradeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UpgradeContainerComponent);
