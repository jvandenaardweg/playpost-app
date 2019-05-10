import React from 'react';
import RNFS from 'react-native-fs';
import VersionNumber from 'react-native-version-number';
import { Text, Switch, Alert, ActivityIndicator } from 'react-native';
import { SettingsScreen as SettingsScreenComponent, SettingsData } from 'react-native-settings-screen';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationRoute, NavigationStackScreenOptions, NavigationInjectedProps } from 'react-navigation';

import { LOCAL_CACHE_AUDIOFILES_PATH, LOCAL_CACHE_VOICE_PREVIEWS_PATH } from '../constants/files';
import fonts from '../constants/fonts';

import { ButtonUpgrade } from '../components/Header/ButtonUpgrade';

import { getUser, deleteUser } from '../reducers/user';
import { resetAudiofilesState } from '../reducers/audiofiles';
import { resetVoicesState, getVoices, resetDownloadedVoices } from '../reducers/voices';

import { getSelectedVoice } from '../selectors/voices';
import { getUserDetails } from '../selectors/user';

import { RootState } from '../reducers';
import { ALERT_SETTINGS_SET_CACHE_SIZE_FAIL, ALERT_SETTINGS_SETTING_UNAVAILABLE, ALERT_SETTINGS_RESET_CACHE_FAIL, ALERT_SETTINGS_CLEAR_CACHE_WARNING, ALERT_SETTINGS_DELETE_USER, ALERT_SETTINGS_DELETE_USER_FAIL } from '../constants/messages';
import { URL_PRIVACY_POLICY, URL_TERMS_OF_USE, URL_ABOUT, URL_FEEDBACK } from '../constants/urls';
import colors from '../constants/colors';
import spacing from '../constants/spacing';

interface IProps extends NavigationInjectedProps {}

type Props = IProps & DispatchProps & StateProps;

interface State {
  cacheSize: string;
  isClearingCache: boolean;
  isLoggingOut: boolean;
  isDeletingAccount: boolean;
}

class SettingsScreenContainer extends React.PureComponent<Props, State> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: 'Settings',
      headerRight: <ButtonUpgrade onPress={navigation.getParam('handleOnPressUpgrade')} />
    };
  }

  state = {
    cacheSize: '0',
    isClearingCache: false,
    isLoggingOut: false,
    isDeletingAccount: false
  };

  componentDidMount() {
    this.props.navigation.setParams({ handleOnPressUpgrade: this.handleOnPressUpgrade });
    this.setCacheSize();
    this.fetchVoices();

    // Pre-populate the user data
    // We only do this once
    if (!this.props.user) {
      this.fetchUser();
    }
  }

  fetchUser = async () => {
    await this.props.getUser();
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
          style: 'destructive',
          onPress: () => this.resetCache()
        }
      ]
    );
  }

  resetCache = async () => {
    return this.setState({ isClearingCache: true }, async () => {
      try {
        await this.doResetCache();
      } catch (err) {
        return Alert.alert('Oops!', ALERT_SETTINGS_RESET_CACHE_FAIL);
      } finally {
        return this.setState({ isClearingCache: false });
      }
    });
  }

  doResetCache = async () => {
    this.props.resetAudiofilesState();
    this.props.resetDownloadedVoices();
    await RNFS.unlink(LOCAL_CACHE_AUDIOFILES_PATH);
    await RNFS.unlink(LOCAL_CACHE_VOICE_PREVIEWS_PATH);
    return this.setCacheSize();
  }

  deleteAccount = async () => {
    return this.setState({ isDeletingAccount: true }, async () => {
      try {
        await this.props.deleteUser();
        return this.props.navigation.navigate('Logout');
      } catch (err) {
        return Alert.alert('Oops!', ALERT_SETTINGS_DELETE_USER_FAIL);
      } finally {
        return this.setState({ isDeletingAccount: false });
      }
    });
  }

  get selectedVoiceLabel() {
    const { selectedVoice } = this.props;
    if (selectedVoice) {
      return `${selectedVoice.label}, ${selectedVoice.languageName} (${selectedVoice.countryCode})`;
    }
    return 'Select voice';
  }

  handleOnPressLogout = async () => this.props.navigation.navigate('Logout');

  handleOnPressUpgrade = () => this.props.navigation.navigate('Upgrade');

  handleOnPressLanguage = () => this.props.navigation.navigate('SettingsVoices');

  handleOnPressAccountPassword = () => this.props.navigation.navigate('UpdatePassword');

  handleOnPressAccountEmail = () => this.props.navigation.navigate('UpdateEmail');

  handleOnPressAccountDelete = () => {
    return Alert.alert(
      'Are you sure?',
      ALERT_SETTINGS_DELETE_USER,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: () => this.deleteAccount()
        }
      ]
    );
  };

  settingsData: SettingsData = [
    {
      type: 'SECTION',
      header: 'Account'.toUpperCase(),
      rows: [
        {
          title: 'Upgrade',
          onPress: this.handleOnPressUpgrade,
          showDisclosureIndicator: true
        },
        {
          title: 'Change e-mail',
          onPress: this.handleOnPressAccountEmail,
          renderAccessory: () => {
            const userEmail = (this.props.user) ? this.props.user.email : null;

            return (
              <Text style={{ color: colors.grayDark, marginRight: 6, fontSize: fonts.fontSize.title, width: 150 }} ellipsizeMode="tail" numberOfLines={1}>
                {userEmail}
              </Text>
            );
          },
          showDisclosureIndicator: true
        },
        {
          title: 'Change password',
          onPress: this.handleOnPressAccountPassword,
          showDisclosureIndicator: true
        },
        {
          title: 'Logout',
          onPress: this.handleOnPressLogout,
          showDisclosureIndicator: true
        }
      ],
    },
    {
      type: 'SECTION',
      header: 'Audio'.toUpperCase(),
      rows: [
        {
          title: 'Voice',
          renderAccessory: () => (
            <Text style={{ color: colors.grayDark, marginRight: 6, fontSize: fonts.fontSize.title }}>
              {this.selectedVoiceLabel}
            </Text>
          ),
          onPress: this.handleOnPressLanguage,
          showDisclosureIndicator: true
        },
        {
          title: 'Playback speed',
          renderAccessory: () => (
            <Text style={{ color: colors.grayDark, marginRight: 6, fontSize: fonts.fontSize.title }}>
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
              <Text style={{ color: colors.grayDark, marginRight: 6, fontSize: fonts.fontSize.title }}>
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
      header: 'About'.toUpperCase(),
      rows: [
        {
          title: 'About',
          onPress: () => this.props.navigation.navigate('Browser', { url: URL_ABOUT, title: 'About' }),
          showDisclosureIndicator: true
        },
        {
          title: 'Privacy Policy',
          onPress: () => this.props.navigation.navigate('Browser', { url: URL_PRIVACY_POLICY, title: 'Privacy Policy' }),
          showDisclosureIndicator: true
        },
        {
          title: 'Terms of Use',
          onPress: () => this.props.navigation.navigate('Browser', { url: URL_TERMS_OF_USE, title: 'Terms of Use' }),
          showDisclosureIndicator: true
        },
        {
          title: 'Feedback',
          onPress: () => this.props.navigation.navigate('Browser', { url: URL_FEEDBACK, title: 'Feedback' }),
          showDisclosureIndicator: true
        },
        {
          title: 'Support',
          onPress: () => this.props.navigation.navigate('Browser', { url: URL_FEEDBACK, title: 'Support' }),
          showDisclosureIndicator: true
        },
      ],
    },
    {
      type: 'CUSTOM_VIEW',
      render: () => (
        <Text
          style={{
            alignSelf: 'center',
            fontSize: fonts.fontSize.title,
            color: colors.grayDark,
            marginBottom: 40
          }}
        >
          Version: {VersionNumber.appVersion}, Build: {VersionNumber.buildVersion}
        </Text>
      ),
    },
    {
      type: 'CUSTOM_VIEW',
      render: () => {
        const { isDeletingAccount } = this.state;

        if (isDeletingAccount) {
          return (<ActivityIndicator />);
        }

        return (
          <Text
            style={{
              alignSelf: 'center',
              fontSize: fonts.fontSize.title,
              color: 'red',
              marginBottom: 40
            }}
            onPress={this.handleOnPressAccountDelete}
          >
            Delete account
          </Text>
        )
      }
    },
  ];

  render() {
    return (
      <SettingsScreenComponent data={this.settingsData} style={{ paddingTop: spacing.default }} globalTextStyle={{ fontSize: fonts.fontSize.title }} />
    );
  }
}

interface DispatchProps {
  resetAudiofilesState: typeof resetAudiofilesState;
  resetVoicesState: typeof resetVoicesState;
  resetDownloadedVoices: typeof resetDownloadedVoices;
  getVoices: typeof getVoices;
  getUser: typeof getUser;
  deleteUser: typeof deleteUser;
}

interface StateProps {
  selectedVoice: ReturnType<typeof getSelectedVoice>;
  user: ReturnType<typeof getUserDetails>;
}

const mapStateToProps = (state: RootState) => ({
  selectedVoice: getSelectedVoice(state),
  user: getUserDetails(state)
});

const mapDispatchToProps = {
  resetAudiofilesState,
  resetVoicesState,
  resetDownloadedVoices,
  getVoices,
  getUser,
  deleteUser
};

export const SettingsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreenContainer);
