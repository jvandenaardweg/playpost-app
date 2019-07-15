import React from 'react';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import * as Keychain from 'react-native-keychain';
import { NavigationInjectedProps, NavigationRoute, NavigationScreenProp, NavigationStackScreenOptions } from 'react-navigation';
import { connect } from 'react-redux';

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

export const keychainArguments = Platform.select({
  ios: { accessGroup: 'group.playpost', service: 'com.aardwegmedia.playpost' },
  android: { service: 'com.aardwegmedia.playpost' }
});

type Props = NavigationInjectedProps & DispatchProps;

class LogoutScreenContainer extends React.PureComponent<Props> {
  public static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: 'Logout'
    };
  }

  public componentDidMount() {
    this.logout();
  }

  public doResetCache = async () => {
    this.props.resetAudiofilesState();
    this.props.resetDownloadedVoices();
    await RNFS.unlink(LOCAL_CACHE_AUDIOFILES_PATH);
    await RNFS.unlink(LOCAL_CACHE_VOICE_PREVIEWS_PATH);
    return;
  }

  public logout = async () => {

    await this.doResetCache();

    // Remove the API token from secure store
    await Keychain.resetGenericPassword(keychainArguments);

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

    return this.props.navigation.navigate('Onboarding');
  }

  public render() {
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
