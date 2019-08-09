import Analytics from 'appcenter-analytics';
import React from 'react';
import isEqual from 'react-fast-compare';
import { Alert, Platform } from 'react-native';
import RNIap from 'react-native-iap';
import { NavigationRoute, NavigationScreenProp } from 'react-navigation';
import { connect } from 'react-redux';

import { NetworkContext } from '../contexts/NetworkProvider';

import { ALERT_SUBSCRIPTION_EXPIRED, ALERT_TITLE_SUBSCRIPTION_EXPIRED } from '../constants/messages';
import { URL_FEEDBACK } from '../constants/urls';
import NavigationService from '../navigation/NavigationService';
import { RootState } from '../reducers';
import { setIsLoadingRestore, setIsLoadingUpgrade, validateSubscriptionReceipt } from '../reducers/subscriptions';
import { getUser } from '../reducers/user';
import { selectAuthenticationStatus } from '../selectors/auth';
import { selectActiveSubscriptionProductId, selectIsSubscribed, selectSubscriptionsError, selectSubscriptionsIsLoadingRestore, selectSubscriptionsIsLoadingUpgrade, selectSubscriptionsValidationResult } from '../selectors/subscriptions';
import { selectUserDetails, selectUserHasSubscribedBefore } from '../selectors/user';

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
    // TODO: only run this component when user is logged in

    // Check every minute if Subscription is still active
    this.validateSubscriptionInterval = setInterval(() => {
      this.validateActiveSubscriptionAtInterval();
    }, 1000 * 60); // Every 1 minute

    this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase: RNIap.ProductPurchase) => {
      try {
        const { productId, transactionReceipt, transactionId } = purchase;

        if (!transactionId) {
          return this.showErrorAlert('Purchase failed', 'No transactionId present in purchase.');
        }

        // Make sure it's loading
        this.props.setIsLoadingUpgrade(true);

        // Validatation error is handeled in APIErrorAlertContainer
        await this.props.validateSubscriptionReceipt(productId, transactionReceipt);

        // Finish the transaction after we validated the receipt
        await RNIap.finishTransactionIOS(transactionId);

        Analytics.trackEvent('Subscriptions upgrade success', { Status: 'success', ProductId: purchase.productId, UserId: this.analyticsUserId });
      } catch (err) {
        // The error from validateSubscriptionReceipt is handled in APIErrorAlertContainer
        console.error('err purchaseupdatelistener', err);
      } finally {
        this.props.setIsLoadingUpgrade(false);
      }
    });

    this.purchaseErrorSubscription = RNIap.purchaseErrorListener(async (error: RNIap.PurchaseError) => {
      const errorMessage = error && error.debugMessage ? error.debugMessage : JSON.stringify(error);

      this.props.setIsLoadingUpgrade(false);

      Analytics.trackEvent('Subscriptions upgrade error', {
        Status: 'error',
        Message: errorMessage,
        UserId: this.analyticsUserId
      });

      this.showErrorAlert(
        'Oops!',
        `If you canceled an upgrade, you can ignore this message.\n\nIf you tried to upgrade please contact our support with this error message:\n\n ${errorMessage}`
      );

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

    if (this.validateSubscriptionInterval) {
      clearInterval(this.validateSubscriptionInterval);
      this.validateSubscriptionInterval = null;
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { isSubscribed, isLoadingRestore, validationResult } = this.props;

    // If the state changes from subscribed, to unsubscribed, notify the user, so the user can re-subscribe again if he wants to.
    if (!isSubscribed && prevProps.isSubscribed) {
      Alert.alert(ALERT_TITLE_SUBSCRIPTION_EXPIRED, ALERT_SUBSCRIPTION_EXPIRED);
    }

    if (isLoadingRestore) {

      if(validationResult && !isEqual(prevProps.validationResult, validationResult)) {
        this.props.setIsLoadingRestore(false);

        return this.showErrorAlert(
          `Subscription is ${validationResult.status}`,
          `In order to use our Premium features, you need to buy a new subscription.\n\nIf you think this is incorrect, please contact support.`
        );
      }
    }
  }

  /**
   * Method to check if the user still has an active subscription when he/she opens the app again.
   * We use the latestReceipt from the Redux store to validate it on our API.
   *
   * Only does an API call when the local receipt is expired.
   */
  validateActiveSubscriptionAtInterval = async () => {
    const { isConnected } = this.context;
    const { authenticationStatus, validationResult, activeSubscriptionProductId, isSubscribed } = this.props;

    // Do not validate when not connected
    if (!isConnected) { return; }

    if (authenticationStatus !== 'LOGGED_IN') { return; }

    if (!validationResult) { return; }

    // Just don't do a check anymore when the subscription is expired or canceled.
    // The user has to manually subscribe again or restore his purchase, which results in a validation within that flow.
    // So we can just block the use of API validation here, as it is not needed. The user has no active subscription anymore.
    if (!isSubscribed) { return; };

    // If we end up here, the user is logged in AND it has a subscription receipt we can validate
    const { expiresAt, latestReceipt } = validationResult;
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

        // Validate the receipt on our server
        await this.props.validateSubscriptionReceipt(activeSubscriptionProductId, latestReceipt);

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

  render() {
    return this.props.children;
  }
}

interface StateProps {
  subscriptionsError: ReturnType<typeof selectSubscriptionsError>;
  validationResult: ReturnType<typeof selectSubscriptionsValidationResult>;
  isSubscribed: ReturnType<typeof selectIsSubscribed>;
  activeSubscriptionProductId: ReturnType<typeof selectActiveSubscriptionProductId>;
  userDetails: ReturnType<typeof selectUserDetails>;
  userHasSubscribedBefore: ReturnType<typeof selectUserHasSubscribedBefore>;
  isLoadingUpgrade: ReturnType<typeof selectSubscriptionsIsLoadingUpgrade>;
  isLoadingRestore: ReturnType<typeof selectSubscriptionsIsLoadingRestore>;
  authenticationStatus: ReturnType<typeof selectAuthenticationStatus>;
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
  userHasSubscribedBefore: selectUserHasSubscribedBefore(state),
  isLoadingUpgrade: selectSubscriptionsIsLoadingUpgrade(state),
  isLoadingRestore: selectSubscriptionsIsLoadingRestore(state),
  authenticationStatus: selectAuthenticationStatus(state)
});

const mapDispatchToProps = {
  validateSubscriptionReceipt,
  getUser,
  setIsLoadingUpgrade,
  setIsLoadingRestore
};

export const SubscriptionHandlerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionHandlerContainerComponent);
