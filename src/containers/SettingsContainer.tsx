import React from 'react';
import { ActivityIndicator, Alert, Linking, Text, View } from 'react-native';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import RNFS from 'react-native-fs';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

import { LOCAL_CACHE_AUDIOFILES_PATH, LOCAL_CACHE_VOICE_PREVIEWS_PATH } from '../constants/files';
import fonts from '../constants/fonts';

import { resetAudiofilesState } from '../reducers/audiofiles';
import { deleteUser, getUser } from '../reducers/user';
import { resetDownloadedVoices, resetVoicesState } from '../reducers/voices';

import { selectUserDetails } from '../selectors/user';

import { CustomSectionList } from '../components/CustomSectionList';
import { Usage } from '../components/Usage';
import colors from '../constants/colors';
import {
  ALERT_SETTINGS_CLEAR_CACHE_WARNING,
  ALERT_SETTINGS_DELETE_USER,
  ALERT_SETTINGS_DELETE_USER_FAIL,
  ALERT_SETTINGS_RESET_CACHE_FAIL,
  ALERT_SETTINGS_SET_CACHE_SIZE_FAIL,
  ALERT_SETTINGS_SETTING_UNAVAILABLE
} from '../constants/messages';
import spacing from '../constants/spacing';
import { URL_ABOUT, URL_DONATE, URL_FEEDBACK, URL_PRIVACY_POLICY, URL_TERMS_OF_USE } from '../constants/urls';
import { RootState } from '../reducers';
import { selectActiveSubscriptionName, selectActiveSubscriptionProductId, selectIsSubscribed } from '../selectors/subscriptions';
import { selectTotalAvailableVoices } from '../selectors/voices';

type Props = NavigationInjectedProps & DispatchProps & StateProps;

interface State {
  cacheSize: string;
  isClearingCache: boolean;
  isLoggingOut: boolean;
  isDeletingAccount: boolean;
}

export class SettingsContainerComponent extends React.PureComponent<Props, State> {
  public state = {
    cacheSize: '0',
    isClearingCache: false,
    isLoggingOut: false,
    isDeletingAccount: false
  };

  public componentDidMount() {
    this.props.navigation.setParams({
      handleOnPressUpgrade: this.handleOnPressUpgrade
    });

    // TODO: Set cache size every time the settings screen becomes active
    this.setCacheSize();

    // Getting the user details, but also the user's settings (for example: user selected voices)
    this.props.getUser();
  }

  public setCacheSize = async () => {
    try {
      let combinedSize = 0;

      await RNFS.mkdir(LOCAL_CACHE_AUDIOFILES_PATH);
      await RNFS.mkdir(LOCAL_CACHE_VOICE_PREVIEWS_PATH);

      const directories = [LOCAL_CACHE_AUDIOFILES_PATH, LOCAL_CACHE_VOICE_PREVIEWS_PATH];
      const sizes = [];

      for (const directory of directories) {
        const files = await RNFS.readDir(directory);
        const size = files.reduce((prev, curr) => {
          /* tslint:disable-next-line no-parameter-reassignment */
          prev = prev + parseFloat(curr.size);
          return prev;
        }, 0);
        sizes.push(size);
      }

      if (sizes.length) {
        combinedSize = sizes.reduce((prev, size) => {
          /* tslint:disable-next-line no-parameter-reassignment */
          prev = prev + size;
          return prev;
        }, 0);
      }

      const sizeInMb = (combinedSize / 1000000).toFixed(2);
      return this.setState({ cacheSize: sizeInMb });
    } catch (err) {
      return Alert.alert('Oops!', ALERT_SETTINGS_SET_CACHE_SIZE_FAIL);
    }
  }

  public handleOnPressRow = () => {
    Alert.alert('Not available', ALERT_SETTINGS_SETTING_UNAVAILABLE);
  }

  public handleOnPressClearCache = async () => {
    return Alert.alert('Are you sure?', ALERT_SETTINGS_CLEAR_CACHE_WARNING, [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Clear cache',
        style: 'destructive',
        onPress: () => this.resetCache()
      }
    ]);
  }

  public resetCache = async () => {
    return this.setState({ isClearingCache: true }, async () => {
      try {
        await this.doResetCache();
      } catch (err) {
        return Alert.alert('Oops!', ALERT_SETTINGS_RESET_CACHE_FAIL);
      } finally {
        this.setState({ isClearingCache: false });
      }
    });
  }

  public doResetCache = async () => {
    this.props.resetAudiofilesState();
    this.props.resetDownloadedVoices();
    await RNFS.unlink(LOCAL_CACHE_AUDIOFILES_PATH);
    await RNFS.unlink(LOCAL_CACHE_VOICE_PREVIEWS_PATH);
    return this.setCacheSize();
  }

  public deleteAccount = async () => {
    return this.setState({ isDeletingAccount: true }, async () => {
      try {
        await this.props.deleteUser();
        return this.props.navigation.navigate('Logout');
      } catch (err) {
        return Alert.alert('Oops!', ALERT_SETTINGS_DELETE_USER_FAIL);
      } finally {
        this.setState({ isDeletingAccount: false });
      }
    });
  }

  public handleOnPressLogout = async () => this.props.navigation.navigate('Logout');

  public handleOnPressUpgrade = (centeredSubscriptionProductId?: string) =>
    this.props.navigation.navigate('Upgrade', {
      centeredSubscriptionProductId
    })

  public handleOnPressLanguage = () => this.props.navigation.navigate('SettingsLanguages');

  public handleOnPressAccountPassword = () => this.props.navigation.navigate('UpdatePassword');

  public handleOnPressAccountEmail = () => this.props.navigation.navigate('UpdateEmail');

  public handleOnPressAccountDelete = () => {
    return Alert.alert('Are you sure?', ALERT_SETTINGS_DELETE_USER, [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Delete account',
        style: 'destructive',
        onPress: () => this.deleteAccount()
      }
    ]);
  }

  public renderDeleteAccount = () => {
    const { isDeletingAccount } = this.state;

    if (isDeletingAccount) {
      return <ActivityIndicator />;
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
    );
  }

  public renderVersionInfo = () => {
    const environment = Config.NODE_ENV;
    const environmentText = environment !== 'production' ? `(Env: ${environment})` : '';
    const versionText = `Version: ${DeviceInfo.getVersion()} (Build: ${DeviceInfo.getBuildNumber()}) ${environmentText}`;

    return (
      <Text
        style={{
          alignSelf: 'center',
          fontSize: fonts.fontSize.body,
          color: colors.grayDark,
          marginBottom: 40,
          marginTop: spacing.large
        }}
      >
        {versionText}
      </Text>
    );
  }

  public renderFooter = () => {
    return (
      <View>
        {this.renderVersionInfo()}
        {this.renderDeleteAccount()}
      </View>
    );
  }

  public render() {
    const { activeSubscriptionName, totalAvailableVoices } = this.props;
    const { isClearingCache, cacheSize } = this.state;

    const sectionListData = [
      {
        title: 'Lanuage',
        data: [
          {
            title: 'Voices & Languages',
            icon: 'globe',
            iconColor: colors.green,
            onPress: this.handleOnPressLanguage,
            value: totalAvailableVoices,
            chevron: true
          }
        ]
      },
      {
        title: 'User',
        data: [
          {
            title: 'Subscription',
            icon: 'star',
            iconColor: colors.tintColor,
            onPress: this.handleOnPressUpgrade,
            chevron: true,
            value: activeSubscriptionName
          },
          {
            title: 'Change e-mail',
            icon: 'mail',
            iconColor: colors.tintColor,
            onPress: this.handleOnPressAccountEmail,
            chevron: true
          },
          {
            title: 'Change password',
            icon: 'lock',
            iconColor: colors.tintColor,
            onPress: this.handleOnPressAccountPassword,
            chevron: true
          },
          {
            title: 'Logout',
            icon: 'log-out',
            iconColor: colors.tintColor,
            onPress: this.handleOnPressLogout,
            chevron: true
          }
        ]
      },
      {
        title: 'Advanced',
        data: [
          {
            title: 'Clear cache',
            icon: 'trash-2',
            iconColor: colors.red,
            onPress: this.handleOnPressClearCache,
            isLoading: isClearingCache,
            value: `${cacheSize} mb`
          }
        ]
      },
      {
        title: 'About',
        data: [
          { title: 'Donate', icon: 'gift', iconColor: colors.grayDark, chevron: true, onPress: () => Linking.openURL(URL_DONATE) },
          {
            title: 'About',
            icon: 'link',
            iconColor: colors.grayDark,
            chevron: true,
            onPress: () =>
              this.props.navigation.navigate('Browser', {
                url: URL_ABOUT,
                title: 'About'
              })
          },
          {
            title: 'Privacy Policy',
            icon: 'link',
            iconColor: colors.grayDark,
            chevron: true,
            onPress: () =>
              this.props.navigation.navigate('Browser', {
                url: URL_PRIVACY_POLICY,
                title: 'Privacy Policy'
              })
          },
          {
            title: 'Terms of Use',
            icon: 'link',
            iconColor: colors.grayDark,
            chevron: true,
            onPress: () =>
              this.props.navigation.navigate('Browser', {
                url: URL_TERMS_OF_USE,
                title: 'Terms of Use'
              })
          },
          {
            title: 'Feedback',
            icon: 'message-square',
            iconColor: colors.grayDark,
            chevron: true,
            onPress: () =>
              this.props.navigation.navigate('Browser', {
                url: URL_FEEDBACK,
                title: 'Feedback'
              })
          },
          {
            title: 'Support',
            icon: 'message-square',
            iconColor: colors.grayDark,
            chevron: true,
            onPress: () =>
              this.props.navigation.navigate('Browser', {
                url: URL_FEEDBACK,
                title: 'Support'
              })
          }
        ]
      }
    ];

    return (
      <CustomSectionList
        sectionListData={sectionListData}
        ListHeaderComponent={
          <View style={{ marginTop: spacing.default * -1, marginLeft: spacing.default * -1, marginRight: spacing.default * -1, marginBottom: spacing.small }}>
            <Usage
              user={this.props.user}
              activeSubscriptionProductId={this.props.activeSubscriptionProductId}
              activeSubscriptionName={this.props.activeSubscriptionName}
              onPressUpgrade={this.handleOnPressUpgrade}
            />
          </View>
        }
        ListFooterComponent={this.renderFooter}
      />
    );
  }
}

interface DispatchProps {
  resetAudiofilesState: typeof resetAudiofilesState;
  resetVoicesState: typeof resetVoicesState;
  resetDownloadedVoices: typeof resetDownloadedVoices;
  getUser: typeof getUser;
  deleteUser: typeof deleteUser;
}

interface StateProps {
  user: ReturnType<typeof selectUserDetails>;
  isSubscribed: ReturnType<typeof selectIsSubscribed>;
  activeSubscriptionName: ReturnType<typeof selectActiveSubscriptionName>;
  activeSubscriptionProductId: ReturnType<typeof selectActiveSubscriptionProductId>;
  totalAvailableVoices: ReturnType<typeof selectTotalAvailableVoices>;
}

const mapStateToProps = (state: RootState) => ({
  user: selectUserDetails(state),
  isSubscribed: selectIsSubscribed(state),
  activeSubscriptionName: selectActiveSubscriptionName(state),
  activeSubscriptionProductId: selectActiveSubscriptionProductId(state),
  totalAvailableVoices: selectTotalAvailableVoices(state)
});

const mapDispatchToProps = {
  resetAudiofilesState,
  resetVoicesState,
  resetDownloadedVoices,
  getUser,
  deleteUser
};

export const SettingsContainer = withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SettingsContainerComponent)
);
