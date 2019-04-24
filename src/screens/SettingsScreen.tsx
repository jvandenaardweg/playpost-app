import React from 'react';
import { Text, Switch, Alert } from 'react-native';
import { SettingsScreen as SettingsScreenComponent, SettingsData } from 'react-native-settings-screen';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import * as Keychain from 'react-native-keychain';
import RNFS from 'react-native-fs';
import VersionNumber from 'react-native-version-number';

import { LOCAL_STORAGE_PATH } from '../constants/files';

import { resetAuthState } from '../reducers/auth';
import { UserState, resetUserState } from '../reducers/user';
import { resetPlayerState } from '../reducers/player';
import { resetPlaylistsState } from '../reducers/playlists';
import { resetAudiofilesState } from '../reducers/audiofiles';
import { persistor } from '../store';

interface Props {
  resetAuthState(): void;
  resetUserState(): void;
  resetPlayerState(): void;
  resetPlaylistsState(): void;
  resetAudiofilesState(): void;
  navigation: NavigationScreenProp<NavigationRoute>;
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
  }

  setCacheSize = async () => {
    try {
      await RNFS.mkdir(LOCAL_STORAGE_PATH);
      const files = await RNFS.readDir(LOCAL_STORAGE_PATH);

      const size = files.reduce(
        (prev, curr) => {
          /* tslint:disable-next-line no-parameter-reassignment */
          prev = prev + parseFloat(curr.size);
          return prev;
        },
        0
      );

      const sizeInMb = (size / 1000000).toFixed(2);
      this.setState({ cacheSize: sizeInMb });
    } catch (err) {
      Alert.alert('Oops!', 'We could not set the cache size.');
    }
  }

  handleOnPressRow = () => {
    Alert.alert('Not available', 'Changing this setting is not available yet. It will be available in later versions.');
  }

  handleOnPressClearCache = async () => {
    try {
      this.props.resetAudiofilesState();
      await RNFS.unlink(LOCAL_STORAGE_PATH);
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

    // Remove the persisted state
    await persistor.purge();

    this.props.navigation.navigate('Onboarding');
  }

  handleOnPressUpgrade = () => this.props.navigation.navigate('Upgrade');

  settingsData: SettingsData = [
    {
      type: 'SECTION',
      header: 'Voice'.toUpperCase(),
      rows: [
        {
          title: 'Language',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 17 }}>
              English (US)
            </Text>
          ),
          onPress: this.handleOnPressRow
        },
        {
          title: 'Gender',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 17 }}>
              Male
            </Text>
          ),
          onPress: this.handleOnPressRow
        },
        {
          title: 'Speed',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 17 }}>
              Normal
            </Text>
          ),
          onPress: this.handleOnPressRow
        }
      ],
    },
    {
      type: 'SECTION',
      header: 'Audio'.toUpperCase(),
      rows: [
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

const mapStateToProps = (state: { user: UserState }) => ({
  user: state.user
});

const mapDispatchToProps = {
  resetAuthState,
  resetUserState,
  resetPlayerState,
  resetPlaylistsState,
  resetAudiofilesState
};

export const SettingsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreenContainer);
