import analytics from '@react-native-firebase/analytics';
import React from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { connect } from 'react-redux';

import { RootState } from '../reducers';
import { getPlaylist } from '../reducers/playlist';

import { setAuthToken } from '../reducers/auth';
import { getInAppSubscriptions, validateSubscriptionReceipt } from '../reducers/subscriptions';
import { getUser, UserTheme } from '../reducers/user';
import { getLanguages } from '../reducers/voices';
import { selectAuthenticationToken, selectIsLoggedIn } from '../selectors/auth';
import { selectSubscriptionsValidationResult } from '../selectors/subscriptions';
import { selectUserActiveSubscriptionProductId, selectUserDetails, selectUserIsSubscribed } from '../selectors/user';
import { store } from '../store';
import * as keychain from '../utils/keychain';
// import { ALERT_SUBSCRIPTION_EXPIRED } from '../constants/messages';

export const AppStateContext = React.createContext<{ appState: AppStateStatus, theme: UserTheme; }>({
  appState: AppState.currentState,
  theme: UserTheme.light // default
});

export const AppStateConsumer = AppStateContext.Consumer;

interface IProps {
  children: React.ReactElement;
}

interface State {
  appState: AppStateStatus;
  theme: UserTheme
}

type Props = IProps & StateProps & DispatchProps;

export class AppStateProviderContainer extends React.PureComponent<Props, State> {
  state = {
    appState: AppState.currentState,
    theme: UserTheme.light // default
  };

  appStateChangeListener: void | null = null;

  async componentDidMount() {
    this.appStateChangeListener = AppState.addEventListener('change', this.handleAppStateChange);

    this.syncAppWithRequiredData();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);

    if (this.appStateChangeListener) {
      this.appStateChangeListener = null;
    }
  }

  componentDidUpdate(prevProps: Props, nextState: State) {
    // Make sure our Analytics always has up to date information about our user
    this.syncUserAnalyticsData();
  }

  /**
   * Method to sync the app with required data used throughout the app.
   * We want to keep this data in sync when the user starts the app, and comes back to the app
   */
  syncAppWithRequiredData = () => {
    const { isLoggedIn } = this.props;

    if (!isLoggedIn) {
      return;
    }

    return Promise.all([
      this.props.getPlaylist(),
      this.props.getUser(),
      this.props.getInAppSubscriptions(),
      this.props.getLanguages()
    ])
  }

  syncUserAnalyticsData = async () => {
    const { user, isSubscribed, activeSubscriptionProductId, isLoggedIn } = this.props;

    if (isLoggedIn && user) {
      await Promise.all([
        analytics().setUserId(user.id),
        analytics().setUserProperties({
          isSubscribed: isSubscribed.toString(),
          subscriptionProductId: activeSubscriptionProductId
        })
      ]);
    }

  }

  /**
   * Method to detect app state changes, like becoming active or inactive when the
   * app goes to the background or foreground.
   */
  handleAppStateChange = async (nextAppState: AppStateStatus) => {
    const { appState } = this.state;
    const fromBackgroundToActive = appState === 'background' && nextAppState === 'active';

    this.setState({ appState: nextAppState }, () => {
      // Do things when app becomes active again
      if (fromBackgroundToActive) {
        // Make sure the token from keychain is in our store
        this.syncAuthToken()

        // Make sure the playlist and user data is up-to-date when user comes back
        this.syncAppWithRequiredData();


      }
    });
  }

  /**
   * A method to sync the auth token.
   * In previous versions we forgot to add it to the store
   * This method makes sure that older users have their token in the store
   */
  syncAuthToken = async () => {
    const { authToken } = this.props;

    // If we have an auth token in the store, we don't need to sync it
    if (authToken) {
      return;
    }

    // Else, sync it

    // Get the token from the keychain
    const token = await keychain.getToken();

    if (token) {
      // Save it in Redux
      store.dispatch(setAuthToken(token));
    }
  }

  /**
   * Fetch additional data when the app becomes active, so our user is always in sync with our API.
   * Without any additional action from the user.
   */
  fetchUserPlaylist = () => {
    const { isLoggedIn } = this.props;

    if (!isLoggedIn) { return; }
    this.props.getPlaylist();
  }

  fetchUser = () => {
    const { isLoggedIn } = this.props;

    if (!isLoggedIn) { return; }
    this.props.getUser();
  }

  fetchInAppSubscriptions = () => {
    const { isLoggedIn } = this.props;

    if (!isLoggedIn) { return; }
    this.props.getInAppSubscriptions();
  }

  render() {
    return <AppStateContext.Provider value={this.state}>{this.props.children}</AppStateContext.Provider>;
  }
}

interface StateProps {
  isLoggedIn: ReturnType<typeof selectIsLoggedIn>;
  subscriptionsValidationResult: ReturnType<typeof selectSubscriptionsValidationResult>;
  activeSubscriptionProductId: ReturnType<typeof selectUserActiveSubscriptionProductId>;
  authToken: ReturnType<typeof selectAuthenticationToken>;
  user: ReturnType<typeof selectUserDetails>;
  isSubscribed: ReturnType<typeof selectUserIsSubscribed>;
}

interface DispatchProps {
  getPlaylist: typeof getPlaylist;
  validateSubscriptionReceipt: typeof validateSubscriptionReceipt;
  getUser: typeof getUser;
  getInAppSubscriptions: typeof getInAppSubscriptions;
  getLanguages: typeof getLanguages;
}

const mapStateToProps = (state: RootState): StateProps => ({
  isLoggedIn: selectIsLoggedIn(state),
  subscriptionsValidationResult: selectSubscriptionsValidationResult(state),
  activeSubscriptionProductId: selectUserActiveSubscriptionProductId(state),
  authToken: selectAuthenticationToken(state),
  user: selectUserDetails(state),
  isSubscribed: selectUserIsSubscribed(state)
});

const mapDispatchToProps = {
  getPlaylist,
  validateSubscriptionReceipt,
  getUser,
  getInAppSubscriptions,
  getLanguages
};

export const AppStateProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppStateProviderContainer);
