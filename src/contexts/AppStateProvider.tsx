import React from 'react';
import { Alert, AppState, AppStateStatus } from 'react-native';
import { connect } from 'react-redux';

import { RootState } from '../reducers';
import { getPlaylist } from '../reducers/playlist';

import { ALERT_SUBSCRIPTION_EXPIRED } from '../constants/messages';
import { validateSubscriptionReceipt } from '../reducers/subscriptions';
import { getUser } from '../reducers/user';
import { selectAuthenticationStatus } from '../selectors/auth';
import { selectActiveSubscriptionProductId, selectIsSubscribed, selectSubscriptionsValidationResult } from '../selectors/subscriptions';
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
  public state = {
    appState: AppState.currentState,
    stateChanged: false,
    isSubscribed: false
  };

  public validateSubscriptionInterval: NodeJS.Timeout | null = null;

  public componentDidMount() {
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

  public componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);

    if (this.validateSubscriptionInterval) {
      clearInterval(this.validateSubscriptionInterval);
      this.validateSubscriptionInterval = null;
    }
  }

  public componentDidUpdate(prevProps: Props) {
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
  public handleAppStateChange = async (nextAppState: AppStateStatus) => {
    const stateChanged = nextAppState === 'active';

    this.setState({ stateChanged, appState: nextAppState }, () => {
      // Do things when app becomes active again
      if (stateChanged && nextAppState === 'active') {
        this.fetchUserPlaylist();
        // TODO: fetch user (usage data)
        this.validateActiveSubscription();
      }
    });
  }

  /**
   * Fetch additional data when the app becomes active, so our user is always in sync with our API.
   * Without any additional action from the user.
   */
  public fetchUserPlaylist = () => {
    const { authenticationStatus } = this.props;

    if (authenticationStatus !== 'LOGGED_IN') { return; }
    this.props.getPlaylist();
  }

  /**
   * Method to check if the user still has an active subscription when he/she opens the app again.
   * We use the latestReceipt from the Redux store to validate it on our API.
   *
   * Only does an API call when the local receipt is expired.
   */
  public validateActiveSubscription = async () => {
    const { authenticationStatus, subscriptionsValidationResult, activeSubscriptionProductId } = this.props;

    if (authenticationStatus !== 'LOGGED_IN') { return; }
    if (!subscriptionsValidationResult) { return; }

    // Just don't do a check anymore when the subscription is expired or canceled.
    // The user has to manually subscribe again or restore his purchase, which results in a validation within that flow.
    // So we can just block the use of API validation here, as it is not needed. The user has no active subscription anymore.
    if (subscriptionsValidationResult.status !== 'active') { return; };

    // If we end up here, the user is logged in AND it has a subscription receipt we can validate
    const { expiresAt, latestReceipt } = subscriptionsValidationResult;
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
        await this.props.validateSubscriptionReceipt(activeSubscriptionProductId, latestReceipt);
        await this.props.getUser(); // Get the user with updated subscription data
      } catch (err) {
        // TODO: handle error
        return err;
      }
    } else {
      // tslint:disable-next-line: no-console
      console.log('Local subscription not expired yet, so we do not validate the receipt just yet.');
    }
  }

  public render() {
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
  getUser: typeof getUser;
}

const mapStateToProps = (state: RootState, props: Props): StateProps => ({
  authenticationStatus: selectAuthenticationStatus(state),
  subscriptionsValidationResult: selectSubscriptionsValidationResult(state),
  isSubscribed: selectIsSubscribed(state),
  activeSubscriptionProductId: selectActiveSubscriptionProductId(state)
});

const mapDispatchToProps = {
  getPlaylist,
  validateSubscriptionReceipt,
  getUser
};

export const AppStateProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppStateProviderContainer);
