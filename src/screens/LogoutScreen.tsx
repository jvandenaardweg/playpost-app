import React from 'react';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationRoute, NavigationStackScreenOptions, NavigationInjectedProps } from 'react-navigation';
import * as Keychain from 'react-native-keychain';

import { LOCAL_CACHE_AUDIOFILES_PATH, LOCAL_CACHE_VOICE_PREVIEWS_PATH } from '../constants/files';

import { resetAuthState } from '../reducers/auth';
import { resetUserState } from '../reducers/user';
import { resetPlayerState } from '../reducers/player';
import { resetPlaylistState } from '../reducers/playlist';
import { resetAudiofilesState } from '../reducers/audiofiles';
import { resetVoicesState, resetDownloadedVoices } from '../reducers/voices';

import { persistor } from '../store';
import { RootState } from '../reducers';
import { CenterLoadingIndicator } from '../components/CenterLoadingIndicator';
import { resetSubscriptionsState } from '../reducers/subscriptions';

export const keychainArguments = Platform.select({
  ios: { accessGroup: 'group.playpost', service: 'com.aardwegmedia.playpost' },
  android: { service: 'com.aardwegmedia.playpost' }
});

interface IProps extends NavigationInjectedProps {}

type Props = IProps & DispatchProps;

class LogoutScreenContainer extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
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
