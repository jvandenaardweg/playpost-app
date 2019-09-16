import Analytics from 'appcenter-analytics';
import { addDays, format } from 'date-fns';
import React from 'react';
import isEqual from 'react-fast-compare';
import { Alert, Platform } from 'react-native';
import RNIap from 'react-native-iap';
import { NavigationRoute, NavigationScreenProp } from 'react-navigation';
import { connect } from 'react-redux';

import { NetworkContext } from '../contexts/NetworkProvider';

import { UpgradeModal } from '../components/UpgradeModal';
import { ALERT_SUBSCRIPTION_EXPIRED, ALERT_SUBSCRIPTION_RESTORE_SUCCESS, ALERT_TITLE_ERROR, ALERT_TITLE_SUBSCRIPTION_EXPIRED, ALERT_TITLE_SUBSCRIPTION_RESTORE_SUCCESS, ALERT_TITLE_SUBSCRIPTION_UPGRADE_ERROR } from '../constants/messages';
import { URL_FEEDBACK } from '../constants/urls';
import NavigationService from '../navigation/NavigationService';
import { RootState } from '../reducers';
import { setIsActiveUpgradeModal, setIsLoadingRestore, setIsLoadingUpgrade, validateSubscriptionReceipt } from '../reducers/subscriptions';
import { getUser } from '../reducers/user';
import { selectIsLoggedIn } from '../selectors/auth';
import { selectIsActiveUpgradeModal, selectSubscriptionsError, selectSubscriptionsIsLoadingRestore, selectSubscriptionsIsLoadingUpgrade, selectSubscriptionsValidationResult } from '../selectors/subscriptions';
import { selectActiveUserInAppSubscription, selectUserDetails, selectUserIsEligibleForTrial, selectUserIsSubscribed } from '../selectors/user';
import { selectTotalAvailableVoices } from '../selectors/voices';
import * as inAppPurchaseHelper from '../utils/in-app-purchase-helper';
import { SUBSCRIPTION_PRODUCT_ID_FREE, SUBSCRIPTION_PRODUCT_ID_PREMIUM, SUBSCRIPTION_PRODUCT_ID_PLUS } from '../constants/in-app-purchase';

interface IProps {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export type Props = IProps & StateProps & DispatchProps;

export class SubscriptionHandlerContainerComponent extends React.PureComponent<Props> {

  get analyticsUserId(): string {
    const { userDetails } = this.props;

    if (!userDetails || !userDetails.id) { return '' };

    return userDetails.id;
  }

  static contextType = NetworkContext;

  /* tslint:disable-next-line no-any */
  purchaseUpdateSubscription: any = null;

  /* tslint:disable-next-line no-any */
  purchaseErrorSubscription: any = null;

  validateSubscriptionInterval: NodeJS.Timeout | null = null;

  componentDidMount() {
    // Check every minute if Subscription is still active
    this.validateSubscriptionInterval = setInterval(() => this.syncUserInAppSubscriptionWithAPI(), 1000 * 60); // Every 1 minute

    this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(this.handlePurchaseUpdateListener);

    this.purchaseErrorSubscription = RNIap.purchaseErrorListener(this.handlePurchaseErrorListener);
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

    if (this.validateSubscriptionInterval) {
      clearInterval(this.validateSubscriptionInterval);
      this.validateSubscriptionInterval = null;
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { isSubscribed, isLoadingRestore, validationResult, isLoggedIn } = this.props;

    if (isLoggedIn) {
      // If the state changes from subscribed, to unsubscribed, notify the user, so the user can re-subscribe again if he wants to.
      if (!isSubscribed && prevProps.isSubscribed) {
        return this.handleSubscriptionStatusExpired();
      }

      if (isLoadingRestore) {
        if(validationResult && !isEqual(prevProps.validationResult, validationResult)) {
          // TODO: correctly handle this
          return this.handleRestoreSubscriptionStatus(validationResult, isSubscribed);
        }
      }
    }

  }

  handleSubscriptionStatusExpired = () => {
    return Alert.alert(ALERT_TITLE_SUBSCRIPTION_EXPIRED, ALERT_SUBSCRIPTION_EXPIRED);
  }

  handleRestoreSubscriptionStatus = (validationResult: Api.ReceiptValidationResponseApple | Api.ReceiptValidationResponseGoogle, isSubscribed: boolean) => {
    this.props.setIsLoadingRestore(false);

    // If the user is still not subscribed, show why
    if (validationResult.status !== 'active') {
      return this.showErrorAlert(
        `Subscription is ${validationResult.status}`,
        `In order to continue using our Premium features, you need to subscribe to a new subscription again.\n\nIf you think this is incorrect, please contact support.`
      );
    } else {
      return Alert.alert(ALERT_TITLE_SUBSCRIPTION_RESTORE_SUCCESS, ALERT_SUBSCRIPTION_RESTORE_SUCCESS);
    }
  }

  handlePurchaseUpdateListener = async (purchase: RNIap.SubscriptionPurchase) => {
    const { isLoggedIn } = this.props;

    // Just do not run anything when the user is not logged in yet
    if (!isLoggedIn) { return; }

    try {
      const { productId, transactionReceipt } = purchase;

      if (!productId) {
        this.props.setIsLoadingUpgrade(false);
        return this.showErrorAlert('Purchase failed', 'No productId present in purchase.');
      }

      // Make sure it's loading
      this.props.setIsLoadingUpgrade(true);

      // Validatation error is handeled in APIErrorAlertContainer
      await this.props.validateSubscriptionReceipt(productId, transactionReceipt, Platform.OS);

      // Get the updated user with the active subscription
      await this.props.getUser();

      // Finish the transaction after we validated the receipt
      await this.finishTransaction(purchase);

      Analytics.trackEvent('Subscriptions upgrade success', { Status: 'success', ProductId: purchase.productId, UserId: this.analyticsUserId });

      return this.props.setIsLoadingUpgrade(false);
    } catch (err) {
      const errorMessage = (err && err.message) ? err.message : 'An unknown error happened while upgrading.';

      this.props.setIsLoadingUpgrade(false);

      return this.showErrorAlert(
        ALERT_TITLE_SUBSCRIPTION_UPGRADE_ERROR,
        `There was an error while upgrading.Please try the "Restore Purchase" button. If that does not help, please contact our support so we can make it right for you. Error message:\n\n${errorMessage}`
      );
    }
  }

  handlePurchaseErrorListener = async (error: RNIap.PurchaseError) => {
    const { isLoggedIn } = this.props;

    // Just do not run anything when the user is not logged in yet
    if (!isLoggedIn) { return; }

    const errorMessage = error && error.debugMessage ? error.debugMessage : JSON.stringify(error);

    const isCancelled = error && error.code === 'E_USER_CANCELLED'; // Only on Android

    this.props.setIsLoadingUpgrade(false);

    Analytics.trackEvent('Subscriptions upgrade error', {
      Status: 'error',
      Message: errorMessage,
      UserId: this.analyticsUserId
    });

    if (!isCancelled) {
      this.showErrorAlert(
        ALERT_TITLE_ERROR,
        `If you canceled an upgrade, you can ignore this message.\n\nIf you tried to upgrade please contact our support with this error message:\n\n ${errorMessage}`
      );
    }

  }

  finishTransaction = async (purchase: RNIap.SubscriptionPurchase) => {
    return inAppPurchaseHelper.finishSubscriptionTransaction(purchase)
  }

  /**
   * Method to check if the user still has an active subscription when he/she opens the app again.
   * We use the latestReceipt from the Redux store to validate it on our API.
   *
   * Only does an API call when the local receipt is expired.
   */
  syncUserInAppSubscriptionWithAPI = async () => {
    const { isConnected } = this.context;
    const { isLoggedIn, isSubscribed, activeInAppSubscription } = this.props;

    // Do not validate when not connected
    if (!isConnected) { return; }

    if (!isLoggedIn) { return; }

    // Just don't do a check anymore when the subscription is expired or canceled.
    // The user has to manually subscribe again or restore his purchase, which results in a validation within that flow.
    // So we can just block the use of API validation here, as it is not needed. The user has no active subscription anymore.
    if (!isSubscribed) { return; };

    if (!activeInAppSubscription || !activeInAppSubscription.inAppSubscription) { return; }

    // If we end up here, the user is logged in AND it has a subscription receipt we can validate
    const { expiresAt } = activeInAppSubscription;
    const expiresAtDateMs = expiresAt ? new Date(expiresAt).getTime() : null;
    const currentTime = Date.now();

    // Check if subscription is expired locally
    // If it is expired locally, we need to validate it on our server to check if the subscription is still active
    // Important: this might allow Jailbreak devs to bypass our subscription validation, as they can just adjust the expiresAtDateMs to always be in the future
    if (expiresAtDateMs && currentTime > expiresAtDateMs) {
      try {
        // tslint:disable-next-line: no-console
        console.warn(
          'User his subscription is expired locally. We validate his latest receipt on our server to check if the user still has a valid subscription.'
        );

        // Sync the user subscription info by requesting the user data
        // The API will sync the subscription if it is expired

        // Get the user with updated subscription data
        await this.props.getUser();
      } catch (err) {
        // TODO: handle error
        return err;
      }
    } else {
      // tslint:disable-next-line: no-console
      console.log('Local subscription not expired yet, so we do not validate the receipt just yet.');
    }
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

  handleOnPressModalCancel = () => {
    this.props.setIsActiveUpgradeModal(false)
  }

  handleOnPressModalUpgrade = () => {
    const { activeInAppSubscription } = this.props;
    const activeProductId = activeInAppSubscription && activeInAppSubscription.inAppSubscription.productId;
    const centeredSubscriptionProductId = (activeProductId === SUBSCRIPTION_PRODUCT_ID_FREE) ? SUBSCRIPTION_PRODUCT_ID_PREMIUM : SUBSCRIPTION_PRODUCT_ID_PLUS;

    NavigationService.navigate('Upgrade', { centeredSubscriptionProductId })
    this.props.setIsActiveUpgradeModal(false)
  }

  render() {
    const { isActiveUpgradeModal, userIsEligibleForTrial, isSubscribed, totalAvailableVoices } = this.props;

    // Give a sense of urgency to the trial, pick a date 2 days from now
    const useTrialUrgencyDate = format(addDays(new Date(), 2), 'EEEE, MMMM do');

    return (
      <>
        <UpgradeModal
          isActive={isActiveUpgradeModal}
          onPressCancel={this.handleOnPressModalCancel}
          onPressUpgrade={this.handleOnPressModalUpgrade}
          isEligibleForTrial={userIsEligibleForTrial}
          isSubscribed={isSubscribed}
          useTrialUrgencyDate={useTrialUrgencyDate}
          totalAvailableVoices={totalAvailableVoices}
        />
        {this.props.children}
      </>
    )
  }
}

interface StateProps {
  subscriptionsError: ReturnType<typeof selectSubscriptionsError>;
  validationResult: ReturnType<typeof selectSubscriptionsValidationResult>;
  isSubscribed: ReturnType<typeof selectUserIsSubscribed>;
  activeInAppSubscription: ReturnType<typeof selectActiveUserInAppSubscription>;
  userDetails: ReturnType<typeof selectUserDetails>;
  isLoadingUpgrade: ReturnType<typeof selectSubscriptionsIsLoadingUpgrade>;
  isLoadingRestore: ReturnType<typeof selectSubscriptionsIsLoadingRestore>;
  isLoggedIn: ReturnType<typeof selectIsLoggedIn>;
  isActiveUpgradeModal: ReturnType<typeof selectIsActiveUpgradeModal>;
  userIsEligibleForTrial: ReturnType<typeof selectUserIsEligibleForTrial>;
  totalAvailableVoices: ReturnType<typeof selectTotalAvailableVoices>;
}

interface DispatchProps {
  validateSubscriptionReceipt: typeof validateSubscriptionReceipt;
  getUser: typeof getUser;
  setIsLoadingUpgrade: typeof setIsLoadingUpgrade;
  setIsLoadingRestore: typeof setIsLoadingRestore;
  setIsActiveUpgradeModal: typeof setIsActiveUpgradeModal;
}

const mapStateToProps = (state: RootState): StateProps => ({
  subscriptionsError: selectSubscriptionsError(state),
  validationResult: selectSubscriptionsValidationResult(state),
  isSubscribed: selectUserIsSubscribed(state),
  activeInAppSubscription: selectActiveUserInAppSubscription(state),
  userDetails: selectUserDetails(state),
  isLoadingUpgrade: selectSubscriptionsIsLoadingUpgrade(state),
  isLoadingRestore: selectSubscriptionsIsLoadingRestore(state),
  isLoggedIn: selectIsLoggedIn(state),
  isActiveUpgradeModal: selectIsActiveUpgradeModal(state),
  userIsEligibleForTrial: selectUserIsEligibleForTrial(state),
  totalAvailableVoices: selectTotalAvailableVoices(state)
});

const mapDispatchToProps = {
  validateSubscriptionReceipt,
  getUser,
  setIsLoadingUpgrade,
  setIsLoadingRestore,
  setIsActiveUpgradeModal
};

export const SubscriptionHandlerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionHandlerContainerComponent);
