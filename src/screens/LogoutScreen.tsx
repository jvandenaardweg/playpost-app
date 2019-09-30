import React from 'react';
import RNFS from 'react-native-fs';
import { NavigationInjectedProps, NavigationRoute, NavigationScreenProp } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';
import { connect } from 'react-redux';
import analytics from '@react-native-firebase/analytics';

import { LOCAL_CACHE_AUDIOFILES_PATH, LOCAL_CACHE_VOICE_PREVIEWS_PATH } from '../constants/files';

import { resetAudiofilesState } from '../reducers/audiofiles';
import { resetAuthState } from '../reducers/auth';
import { resetPlayerState } from '../reducers/player';
import { resetPlaylistState } from '../reducers/playlist';
import { resetUserState } from '../reducers/user';
import { resetDownloadedVoices, resetVoicesState } from '../reducers/voices';

import { CenterLoadingIndicator } from '../components/CenterLoadingIndicator';
import { RootState } from '../reducers';
import { resetSubscriptionsState } from '../reducers/subscriptions';
import { persistor } from '../store';
import * as keychain from '../utils/keychain';

type Props = NavigationInjectedProps & DispatchProps;

class LogoutScreenContainer extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackOptions => {
    return {
      title: 'Logout'
    };
  }

  componentDidMount() {
    this.logout();
  }

  doResetCache = async () => {
    this.props.resetAudiofilesState();
    this.props.resetDownloadedVoices();
    await RNFS.unlink(LOCAL_CACHE_AUDIOFILES_PATH);
    await RNFS.unlink(LOCAL_CACHE_VOICE_PREVIEWS_PATH);
    return;
  }

  logout = async () => {

    await this.doResetCache();

    // Remove the API token from secure store
    await keychain.resetToken();

    // Remove the persisted state
    await persistor.purge();

    // Reset all the stores to it's original state
    this.props.resetAuthState();
    this.props.resetUserState();
    this.props.resetPlayerState();
    this.props.resetPlaylistState();
    this.props.resetAudiofilesState();
    this.props.resetVoicesState();
    this.props.resetSubscriptionsState();

    // Reset all analytics data
    await analytics().resetAnalyticsData();

    return this.props.navigation.navigate('Onboarding');
  }

  render() {
    return (
      <CenterLoadingIndicator />
    );
  }
}

interface DispatchProps {
  resetAuthState: typeof resetAuthState;
  resetUserState: typeof resetUserState;
  resetPlayerState: typeof resetPlayerState;
  resetPlaylistState: typeof resetPlaylistState;
  resetAudiofilesState: typeof resetAudiofilesState;
  resetVoicesState: typeof resetVoicesState;
  resetSubscriptionsState: typeof resetSubscriptionsState;
  resetDownloadedVoices: typeof resetDownloadedVoices;
}

const mapStateToProps = (state: RootState) => ({});

const mapDispatchToProps = {
  resetAuthState,
  resetUserState,
  resetPlayerState,
  resetPlaylistState,
  resetAudiofilesState,
  resetVoicesState,
  resetSubscriptionsState,
  resetDownloadedVoices
};

export const LogoutScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(LogoutScreenContainer);
