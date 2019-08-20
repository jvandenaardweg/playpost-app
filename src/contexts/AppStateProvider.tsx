import React from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { connect } from 'react-redux';

import { RootState } from '../reducers';
import { getPlaylist } from '../reducers/playlist';

import { setAuthToken } from '../reducers/auth';
import { validateSubscriptionReceipt } from '../reducers/subscriptions';
import { getUser } from '../reducers/user';
import { selectAuthenticationToken, selectIsLoggedIn } from '../selectors/auth';
import { selectActiveSubscriptionProductId, selectSubscriptionsValidationResult } from '../selectors/subscriptions';
import { store } from '../store';
import * as keychain from '../utils/keychain';
// import { ALERT_SUBSCRIPTION_EXPIRED } from '../constants/messages';

export const AppStateContext = React.createContext<{ appState: AppStateStatus; }>({
  appState: AppState.currentState
});

export const AppStateConsumer = AppStateContext.Consumer;

interface IProps {
  children: React.ReactElement;
}

interface State {
  appState: AppStateStatus;
}

type Props = IProps & StateProps & DispatchProps;

export class AppStateProviderContainer extends React.PureComponent<Props, State> {
  state = {
    appState: AppState.currentState
  };

  appStateChangeListener: void | null = null;

  componentDidMount() {
    this.appStateChangeListener = AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);

    if (this.appStateChangeListener) {
      this.appStateChangeListener = null;
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
        this.fetchUserPlaylist();
        this.fetchUser();
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

  render() {
    return <AppStateContext.Provider value={this.state}>{this.props.children}</AppStateContext.Provider>;
  }
}

interface StateProps {
  isLoggedIn: ReturnType<typeof selectIsLoggedIn>;
  subscriptionsValidationResult: ReturnType<typeof selectSubscriptionsValidationResult>;
  activeSubscriptionProductId: ReturnType<typeof selectActiveSubscriptionProductId>;
  authToken: ReturnType<typeof selectAuthenticationToken>;
}

interface DispatchProps {
  getPlaylist: typeof getPlaylist;
  validateSubscriptionReceipt: typeof validateSubscriptionReceipt;
  getUser: typeof getUser;
}

const mapStateToProps = (state: RootState): StateProps => ({
  isLoggedIn: selectIsLoggedIn(state),
  subscriptionsValidationResult: selectSubscriptionsValidationResult(state),
  activeSubscriptionProductId: selectActiveSubscriptionProductId(state),
  authToken: selectAuthenticationToken(state)
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
