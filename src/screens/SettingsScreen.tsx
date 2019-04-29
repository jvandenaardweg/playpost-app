import React from 'react';
import RNFS from 'react-native-fs';
import VersionNumber from 'react-native-version-number';
import { Text, Switch, Alert, ActivityIndicator } from 'react-native';
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
import { ALERT_SETTINGS_SET_CACHE_SIZE_FAIL, ALERT_SETTINGS_SETTING_UNAVAILABLE, ALERT_SETTINGS_RESET_CACHE_FAIL, ALERT_SETTINGS_CLEAR_CACHE_WARNING } from '../constants/messages';

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
  isClearingCache: boolean;
}

class SettingsScreenContainer extends React.PureComponent<Props, State> {
  static navigationOptions = {
    title: 'Settings'
  };

  state = {
    cacheSize: '0',
    isClearingCache: false
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
      return Alert.alert('Oops!', ALERT_SETTINGS_SET_CACHE_SIZE_FAIL);
    }
  }

  handleOnPressRow = () => {
    Alert.alert('Not available', ALERT_SETTINGS_SETTING_UNAVAILABLE);
  }

  handleOnPressClearCache = async () => {
    return Alert.alert(
      'Are you sure?',
      ALERT_SETTINGS_CLEAR_CACHE_WARNING,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear cache',
          onPress: () => this.resetCache()
        }
      ]
    );
  }

  resetCache = async () => {
    return this.setState({ isClearingCache: true }, async () => {
      try {
        this.props.resetAudiofilesState();
        this.props.resetDownloadedVoices();
        await RNFS.unlink(LOCAL_CACHE_AUDIOFILES_PATH);
        await RNFS.unlink(LOCAL_CACHE_VOICE_PREVIEWS_PATH);
        return this.setCacheSize();
      } catch (err) {
        return Alert.alert('Oops!', ALERT_SETTINGS_RESET_CACHE_FAIL);
      } finally {
        return this.setState({ isClearingCache: false });
      }
    });
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
    }
    return 'Select voice';
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
          onPress: this.handleOnPressLanguage,
          showDisclosureIndicator: true
        },
        {
          title: 'Quality',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 17 }}>
              Normal
            </Text>
          ),
          onPress: this.handleOnPressRow,
          showDisclosureIndicator: true
        },
        {
          title: 'Playback speed',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 17 }}>
              Normal (1x)
            </Text>
          ),
          onPress: this.handleOnPressRow,
          showDisclosureIndicator: true
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
          renderAccessory: () => {
            const { isClearingCache, cacheSize } = this.state;
            if (isClearingCache) {
              return (<ActivityIndicator />);
            }

            return (
              <Text style={{ color: '#999', marginRight: 6, fontSize: 17 }}>
                {cacheSize} mb
              </Text>
            );
          },
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
