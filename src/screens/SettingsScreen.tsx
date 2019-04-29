import React from 'react';
import RNFS from 'react-native-fs';
import VersionNumber from 'react-native-version-number';
import { Text, Switch, Alert } from 'react-native';
import { SettingsScreen as SettingsScreenComponent, SettingsData } from 'react-native-settings-screen';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import * as Keychain from 'react-native-keychain';

import { LOCAL_CACHE_AUDIOFILES_PATH, LOCAL_CACHE_VOICE_PREVIEWS_PATH } from '../constants/files';

import { resetAuthState } from '../reducers/auth';
import { resetUserState } from '../reducers/user';
import { resetPlayerState } from '../reducers/player';
import { resetPlaylistsState } from '../reducers/playlists';
import { resetAudiofilesState } from '../reducers/audiofiles';
import { resetVoicesState, getVoices, resetDownloadedVoices } from '../reducers/voices';

import { getSelectedVoice } from '../selectors/voices';

import { persistor } from '../store';
import { RootState } from '../reducers';

interface Props {
  resetAuthState(): void;
  resetUserState(): void;
  resetPlayerState(): void;
  resetPlaylistsState(): void;
  resetAudiofilesState(): void;
  resetVoicesState(): void;
  getVoices(): void;
  resetDownloadedVoices(): void;
  navigation: NavigationScreenProp<NavigationRoute>;
  selectedVoice: Api.Voice | undefined;
}

interface State {
  cacheSize: string;
}

class SettingsScreenContainer extends React.PureComponent<Props, State> {
  static navigationOptions = {
    title: 'Settings'
  };

  state = {
    cacheSize: '0'
  };

  componentDidMount() {
    this.setCacheSize();
    this.fetchVoices();
  }

  fetchVoices = async () => {
    await this.props.getVoices();
  }

  setCacheSize = async () => {
    try {
      let combinedSize = 0;

      await RNFS.mkdir(LOCAL_CACHE_AUDIOFILES_PATH);
      await RNFS.mkdir(LOCAL_CACHE_VOICE_PREVIEWS_PATH);

      const directories = [LOCAL_CACHE_AUDIOFILES_PATH, LOCAL_CACHE_VOICE_PREVIEWS_PATH];
      const sizes = [];

      for (const directory of directories) {
        const files = await RNFS.readDir(directory);
        const size = files.reduce(
          (prev, curr) => {
            /* tslint:disable-next-line no-parameter-reassignment */
            prev = prev + parseFloat(curr.size);
            return prev;
          },
          0
        );
        sizes.push(size);
      }

      if (sizes.length) {
        combinedSize = sizes.reduce(
          (prev, size) => {
            /* tslint:disable-next-line no-parameter-reassignment */
            prev = prev + size;
            return prev;
          },
          0
        );
      }

      const sizeInMb = (combinedSize / 1000000).toFixed(2);
      return this.setState({ cacheSize: sizeInMb });
    } catch (err) {
      return Alert.alert('Oops!', 'We could not set the cache size.');
    }
  }

  handleOnPressRow = () => {
    Alert.alert('Not available', 'Changing this setting is not available yet. It will be available in later versions.');
  }

  handleOnPressClearCache = async () => {
    try {
      this.props.resetAudiofilesState();
      this.props.resetDownloadedVoices();
      await RNFS.unlink(LOCAL_CACHE_AUDIOFILES_PATH);
      await RNFS.unlink(LOCAL_CACHE_VOICE_PREVIEWS_PATH);
      this.setCacheSize();
      Alert.alert('Cache is cleared!', 'You should now have more space available.');
    } catch (err) {
      Alert.alert('Oops!', 'We could not delete the cache. Please try again.');
    }
  }

  handleOnPressLogout = async () => {
    // Remove the token from secure store
    await Keychain.resetGenericPassword();

    // Reset all the stores to it's original state
    this.props.resetAuthState();
    this.props.resetUserState();
    this.props.resetPlayerState();
    this.props.resetPlaylistsState();
    this.props.resetAudiofilesState();
    this.props.resetVoicesState();

    // Remove the persisted state
    await persistor.purge();

    this.props.navigation.navigate('Onboarding');
  }

  get selectedVoiceLabel() {
    const { selectedVoice } = this.props;
    if (selectedVoice) {
      return `${selectedVoice.label}, ${selectedVoice.languageName} (${selectedVoice.countryCode})`;
    } else {
      return 'Select voice';
    }
  }

  handleOnPressUpgrade = () => this.props.navigation.navigate('Upgrade');

  handleOnPressLanguage = () => this.props.navigation.navigate('SettingsVoices');

  settingsData: SettingsData = [
    {
      type: 'SECTION',
      header: 'Audio'.toUpperCase(),
      rows: [
        {
          title: 'Voice',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 17 }}>
              {this.selectedVoiceLabel}
            </Text>
          ),
          onPress: this.handleOnPressLanguage
        },
        {
          title: 'Quality',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 17 }}>
              Normal
            </Text>
          ),
          onPress: this.handleOnPressRow
        },
        {
          title: 'Auto play next article',
          renderAccessory: () => <Switch value={false} onValueChange={() => this.handleOnPressRow()} />,
          onPress: this.handleOnPressRow
        },
        {
          title: 'Auto archive played articles',
          renderAccessory: () => <Switch value={false} onValueChange={() => this.handleOnPressRow()} />,
          onPress: this.handleOnPressRow
        }
      ],
    },
    {
      type: 'SECTION',
      header: 'Advanced'.toUpperCase(),
      rows: [
        {
          title: 'Clear cache',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 17 }}>
              {this.state.cacheSize} mb
            </Text>
          ),
          onPress: this.handleOnPressClearCache
        },
      ],
    },
    {
      type: 'SECTION',
      header: 'Account'.toUpperCase(),
      rows: [
        {
          title: 'Upgrade',
          onPress: this.handleOnPressUpgrade
        },
        {
          title: 'Logout',
          onPress: this.handleOnPressLogout
        }
      ],
    },
    {
      type: 'CUSTOM_VIEW',
      render: () => (
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 16,
            color: '#999',
            marginBottom: 40
          }}
        >
          Version: {VersionNumber.appVersion}, Build: {VersionNumber.buildVersion}
        </Text>
      ),
    },
  ];

  render() {
    return (
      <SettingsScreenComponent data={this.settingsData} style={{ paddingTop: 14 }} />
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  selectedVoice: getSelectedVoice(state)
});

const mapDispatchToProps = {
  resetAuthState,
  resetUserState,
  resetPlayerState,
  resetPlaylistsState,
  resetAudiofilesState,
  resetVoicesState,
  resetDownloadedVoices,
  getVoices
};

export const SettingsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreenContainer);
