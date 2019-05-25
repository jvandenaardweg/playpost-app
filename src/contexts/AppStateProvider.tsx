import React from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { connect } from 'react-redux';

import { RootState } from '../reducers';
import { getPlaylist } from '../reducers/playlist';
import { updateUserEmail, getUser } from '../reducers/user';

import { getAuthenticationStatus } from '../selectors/auth';

export const AppStateContext = React.createContext<{ appState: AppStateStatus, stateChanged: boolean }>({ appState: AppState.currentState, stateChanged: false });

export const AppStateConsumer = AppStateContext.Consumer;

interface IProps {
  children: React.ReactElement;
}
interface State {
  appState: AppStateStatus;
  stateChanged: boolean;
}

type Props = IProps & StateProps & DispatchProps;

export class AppStateProviderContainer extends React.PureComponent<Props, State> {
  state = {
    appState: AppState.currentState,
    stateChanged: false
  };

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = async (nextAppState: AppStateStatus) => {
    const { authenticationStatus } = this.props;
    const stateChanged = !!(this.state.appState.match(/inactive|background/) && nextAppState === 'active');

    console.log('AppStateProvider', 'App State Changed:', stateChanged, nextAppState);

    // Detect a change in AppState
    this.setState({
      stateChanged,
      appState: nextAppState
    });

    // Fetch additional data when the app becomes active
    // TODO: get user?
    if (authenticationStatus === 'LOGGED_IN' && stateChanged && nextAppState === 'active') {
      console.log('App became active again, get the user his playlist...');
      this.props.getPlaylist();
    }
  }

  render() {
    return (
      <AppStateContext.Provider value={this.state}>
        {this.props.children}
      </AppStateContext.Provider>
    );
  }
}

interface StateProps {
  authenticationStatus: ReturnType<typeof getAuthenticationStatus>;
}

interface DispatchProps {
  getPlaylist: typeof getPlaylist;
}

const mapStateToProps = (state: RootState): StateProps => ({
  authenticationStatus: getAuthenticationStatus(state)
});

const mapDispatchToProps = {
  getPlaylist
};

export const AppStateProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppStateProviderContainer);
