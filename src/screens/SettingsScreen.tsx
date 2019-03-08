import React from 'react';
import { Text, Switch, Alert, AsyncStorage } from 'react-native';
import { SettingsScreen as SettingsScreenComponent, SettingsData } from 'react-native-settings-screen';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';

import { removeAuth } from '../reducers/auth';
import { MeState, removeMe } from '../reducers/me';
import { removeUser } from '../reducers/users';
import { removePlayer } from '../reducers/player';

interface Props {
  removeAuth(): void
  removeMe(): void
  removeUser(): void
  removePlayer(): void
  navigation: NavigationScreenProp<NavigationRoute>
}

class SettingsScreenContainer extends React.PureComponent<Props> {
  static navigationOptions = {
    title: 'Settings'
  };

  handleOnPressRow = () => {
    Alert.alert('Changing this setting becomes available in later versions.');
  }

  handleOnPressLogout = async () => {
    await AsyncStorage.removeItem('userToken');

    // Reset all the stores to it's original state
    this.props.removeAuth();
    this.props.removeMe();
    this.props.removeUser();
    this.props.removePlayer();

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
              50.5MB
            </Text>
          ),
          onPress: this.handleOnPressRow
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

const mapStateToProps = (state: { me: MeState }) => ({
  me: state.me
});

const mapDispatchToProps = {
  removeAuth,
  removeMe,
  removeUser,
  removePlayer
};

export const SettingsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreenContainer);
