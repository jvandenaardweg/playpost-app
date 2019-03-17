import React from 'react';
import { Text, Switch, Alert } from 'react-native';
import { SettingsScreen as SettingsScreenComponent, SettingsData } from 'react-native-settings-screen';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import * as Keychain from 'react-native-keychain';
import RNFS from 'react-native-fs';

import { LOCAL_STORAGE_PATH } from '../constants/files';

import { resetAuthState } from '../reducers/auth';
import { UserState, resetUserState } from '../reducers/user';
import { resetPlayerState } from '../reducers/player';
import { resetPlaylistsState } from '../reducers/playlists';

interface Props {
  resetAuthState(): void;
  resetUserState(): void;
  resetPlayerState(): void;
  resetPlaylistsState(): void;
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

      const size = files.reduce((prev, curr) => {
        /* tslint:disable-next-line no-parameter-reassignment */
        prev = prev + parseFloat(curr.size);
        return prev;
      }, 0);

      const sizeInMb = (size / 1000000).toFixed(2);
      this.setState({ cacheSize: sizeInMb });
    } catch (err) {
      Alert.alert('Oops!', 'We could not set the cache size.');
    }
  }

  handleOnPressRow = () => {
    Alert.alert('Changing this setting becomes available in later versions.');
  }

  handleOnPressClearCache = async () => {
    try {
      await RNFS.unlink(LOCAL_STORAGE_PATH);
      this.setCacheSize();
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

    this.props.navigation.navigate('Login');
  }

  settingsData: SettingsData = [
    {
      type: 'SECTION',
      header: 'Voice'.toUpperCase(),
      footer:
        'Changing the voice settings becomes available in later versions.',
      rows: [
        {
          title: 'Language',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              English
            </Text>
          ),
          onPress: this.handleOnPressRow
        },
        {
          title: 'Accent',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              American
            </Text>
          ),
          onPress: this.handleOnPressRow
        },
        {
          title: 'Gender',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              Male
            </Text>
          ),
          onPress: this.handleOnPressRow
        },
        {
          title: 'Speed',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
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
      footer:
        'Changing the audio settings becomes available in later versions.',
      rows: [
        {
          title: 'Quality',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              Normal
            </Text>
          ),
          onPress: this.handleOnPressRow
        },
        {
          title: 'Auto play next article',
          renderAccessory: () => <Switch value onValueChange={() => {}} />,
          onPress: this.handleOnPressRow
        },
        {
          title: 'Auto archive played articles',
          renderAccessory: () => <Switch value onValueChange={() => {}} />,
          onPress: this.handleOnPressRow
        },
        {
          title: 'Auto scroll text',
          renderAccessory: () => <Switch value onValueChange={() => {}} />,
          onPress: this.handleOnPressRow
        }
      ],
    },
    {
      type: 'SECTION',
      header: 'Advanced'.toUpperCase(),
      footer:
        'Changing the advanced settings becomes available in later versions.',
      rows: [
        {
          title: 'Default browser',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              Safari
            </Text>
          ),
          onPress: this.handleOnPressRow
        },
        {
          title: 'Clear cache',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
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
      footer:
        'Changing the account settings becomes available in later versions.',
      rows: [
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
            fontSize: 18,
            color: '#999',
            marginBottom: 40,
            marginTop: -30,
          }}
        >
          v1.2.3
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
  resetPlaylistsState
};

export const SettingsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreenContainer);
