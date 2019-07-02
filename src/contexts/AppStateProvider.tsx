import React from 'react';
import { AppState, AppStateStatus, Alert } from 'react-native';
import { connect } from 'react-redux';

import { RootState } from '../reducers';
import { getPlaylist } from '../reducers/playlist';

import { selectAuthenticationStatus } from '../selectors/auth';
import { selectSubscriptionsValidationResult, selectIsSubscribed, selectActiveSubscriptionProductId } from '../selectors/subscriptions';
import { validateSubscriptionReceipt } from '../reducers/subscriptions';
import { ALERT_SUBSCRIPTION_EXPIRED } from '../constants/messages';
// import { ALERT_SUBSCRIPTION_EXPIRED } from '../constants/messages';

export const AppStateContext = React.createContext<{ appState: AppStateStatus; stateChanged: boolean; isSubscribed: boolean }>({
  appState: AppState.currentState,
  stateChanged: false,
  isSubscribed: false
});

export const AppStateConsumer = AppStateContext.Consumer;

interface IProps {
  children: React.ReactElement;
}
interface State {
  appState: AppStateStatus;
  stateChanged: boolean;
  isSubscribed: boolean;
}

type Props = IProps & StateProps & DispatchProps;

export class AppStateProviderContainer extends React.PureComponent<Props, State> {
  state = {
    appState: AppState.currentState,
    stateChanged: false,
    isSubscribed: false
  };

  validateSubscriptionInterval: NodeJS.Timeout | null = null;

  componentDidMount() {
    const { isSubscribed } = this.props;

    AppState.addEventListener('change', this.handleAppStateChange);

    this.setState({ isSubscribed }, () => {
      this.validateActiveSubscription();
    });

    // Check every minute if Subscription is still active
    this.validateSubscriptionInterval = setInterval(() => {
      this.validateActiveSubscription();
    }, 1000 * 60); // Every 1 minute
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);

    if (this.validateSubscriptionInterval) {
      clearInterval(this.validateSubscriptionInterval);
      this.validateSubscriptionInterval = null;
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { isSubscribed } = this.props;

    if (prevProps.isSubscribed !== isSubscribed) {
      // If the state changes from subscribed, to unsubscribed, notify the user, so the user can re-subscribe again if he wants to.
      if (!isSubscribed) {
        Alert.alert('Subscription expired', ALERT_SUBSCRIPTION_EXPIRED);
      }

      this.setState({ isSubscribed });
    }
  }

  /**
   * Method to detect app state changes, like becoming active or inactive when the
   * app goes to the background or foreground.
   */
  handleAppStateChange = async (nextAppState: AppStateStatus) => {
    const stateChanged = nextAppState === 'active';

    console.log('AppStateProvider', 'App State Changed:', stateChanged, nextAppState);

    this.setState({ stateChanged, appState: nextAppState }, () => {
      // Do things when app becomes active again
      if (stateChanged && nextAppState === 'active') {
        this.fetchUserPlaylist();
        this.validateActiveSubscription();
      }
    });
  }

  /**
   * Fetch additional data when the app becomes active, so our user is always in sync with our API.
   * Without any additional action from the user.
   */
  fetchUserPlaylist = () => {
    const { authenticationStatus } = this.props;

    console.log('App became active again, get the user his playlist...');

    if (authenticationStatus !== 'LOGGED_IN') return console.warn('User is not logged in, so we cannot get the user his playlist.');
    this.props.getPlaylist();
  }

  /**
   * Method to check if the user still has an active subscription when he/she opens the app again.
   * We use the latestReceipt from the Redux store to validate it on our API.
   *
   * Only does an API call when the local receipt is expired.
   */
  validateActiveSubscription = async () => {
    const { authenticationStatus, subscriptionsValidationResult, validateSubscriptionReceipt, activeSubscriptionProductId } = this.props;

    if (authenticationStatus !== 'LOGGED_IN') return console.warn('User is not logged in, so we cannot check if his subscription is expired.');
    if (!subscriptionsValidationResult) {
      return console.warn('No subscriptionsValidationResult found to validate the users subscription. Probably because the user has no subscription.');
    }

    // Just don't do a check anymore when the subscription is expired or canceled.
    // The user has to manually subscribe again or restore his purchase, which results in a validation within that flow.
    // So we can just block the use of API validation here, as it is not needed. The user has no active subscription anymore.
    if (subscriptionsValidationResult.status !== 'active') {
      return console.warn('User his subscription status is not active, so we dont need to validate it with our server for now.');
    }

    // If we end up here, the user is logged in AND it has a subscription receipt we can validate
    const { expiresAt, latestReceipt } = subscriptionsValidationResult;
    const expiresAtDateMs = expiresAt ? new Date(expiresAt).getTime() : null;
    const currentTime = Date.now();

    // Check if subscription is expired locally
    // If it is expired locally, we need to validate it on our server to check if the subscription is still active
    // Important: this might allow Jailbreak devs to bypass our subscription validation, as they can just adjust the expiresAtDateMs to always be in the future
    if (expiresAtDateMs && currentTime > expiresAtDateMs) {
      try {
        console.warn(
          'User his subscription is expired locally. We validate his latest receipt on our server to check if the user still has a valid subscription.'
        );
        await validateSubscriptionReceipt(activeSubscriptionProductId, latestReceipt);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log('Local subscription not expired yet, so we do not validate the receipt just yet.');
    }
  }

  render() {
    return <AppStateContext.Provider value={this.state}>{this.props.children}</AppStateContext.Provider>;
  }
}

interface StateProps {
  authenticationStatus: ReturnType<typeof selectAuthenticationStatus>;
  subscriptionsValidationResult: ReturnType<typeof selectSubscriptionsValidationResult>;
  isSubscribed: ReturnType<typeof selectIsSubscribed>;
  activeSubscriptionProductId: ReturnType<typeof selectActiveSubscriptionProductId>;
}

interface DispatchProps {
  getPlaylist: typeof getPlaylist;
  validateSubscriptionReceipt: typeof validateSubscriptionReceipt;
}

const mapStateToProps = (state: RootState, props: Props): StateProps => ({
  authenticationStatus: selectAuthenticationStatus(state),
  subscriptionsValidationResult: selectSubscriptionsValidationResult(state),
  isSubscribed: selectIsSubscribed(state),
  activeSubscriptionProductId: selectActiveSubscriptionProductId(state)
});

const mapDispatchToProps = {
  getPlaylist,
  validateSubscriptionReceipt
};

export const AppStateProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppStateProviderContainer);
