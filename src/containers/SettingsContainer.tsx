import React from 'react';
import isEqual from 'react-fast-compare';
import { ActivityIndicator, Alert, InteractionManager, Linking, Text, View } from 'react-native';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import RNFS from 'react-native-fs';
import { NavigationInjectedProps } from 'react-navigation';
import { connect } from 'react-redux';

import colors from '../constants/colors';
import { LOCAL_CACHE_AUDIOFILES_PATH, LOCAL_CACHE_VOICE_PREVIEWS_PATH } from '../constants/files';
import fonts from '../constants/fonts';
import {
  ALERT_SETTINGS_CLEAR_CACHE_WARNING,
  ALERT_SETTINGS_DELETE_USER,
  ALERT_SETTINGS_DELETE_USER_FAIL,
  ALERT_SETTINGS_RESET_CACHE_FAIL,
  ALERT_SETTINGS_SET_CACHE_SIZE_FAIL,
  ALERT_TITLE_ERROR,
  ALERT_TITLE_REQUEST_CONFIRM} from '../constants/messages';
import spacing from '../constants/spacing';
import { URL_ABOUT, URL_APP_APPLE_APP_STORE_REVIEW, URL_FEEDBACK, URL_PRIVACY_POLICY, URL_TERMS_OF_USE } from '../constants/urls';

import { RootState } from '../reducers';
import { resetAudiofilesState } from '../reducers/audiofiles';
import { deleteUser, getUser } from '../reducers/user';
import { resetDownloadedVoices, resetVoicesState } from '../reducers/voices';

import { selectActiveSubscriptionName, selectActiveSubscriptionProductId, selectIsSubscribed } from '../selectors/subscriptions';
import { selectUserDetails, selectUserHasSubscribedBefore } from '../selectors/user';
import { selectTotalAvailableVoices } from '../selectors/voices';

import { CustomSectionList } from '../components/CustomSectionList';
import { Usage } from '../components/Usage';

import { SUBSCRIPTION_FREE_SKU, SUBSCRIPTION_PLUS_SKU, SUBSCRIPTION_PREMIUM_SKU } from '../constants/in-app-purchase';
import NavigationService from '../navigation/NavigationService';


type Props = NavigationInjectedProps & DispatchProps & StateProps;

interface State {
  cacheSize: string;
  isClearingCache: boolean;
  isLoggingOut: boolean;
  isDeletingAccount: boolean;
}

export class SettingsContainerComponent extends React.Component<Props, State> {
  state = {
    cacheSize: '0',
    isClearingCache: false,
    isLoggingOut: false,
    isDeletingAccount: false
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      // TODO: Set cache size every time the settings screen becomes active
      this.setCacheSize();

      // Getting the user details, but also the user's settings (for example: user selected voices)
      this.props.getUser();
    });
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    // If there's a state change inside the component, always update it
    if (!isEqual(this.state, nextState)) {
      return true;
    }

    // Only update this component when we have new playlist items
    if (!isEqual(this.props, nextProps)) {
      return true;
    }

    return false;
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
      return Alert.alert(ALERT_TITLE_ERROR, ALERT_SETTINGS_SET_CACHE_SIZE_FAIL);
    }
  }

  handleOnPressClearCache = async () => {
    return Alert.alert(ALERT_TITLE_REQUEST_CONFIRM, ALERT_SETTINGS_CLEAR_CACHE_WARNING, [
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

  resetCache = async () => {
    return this.setState({ isClearingCache: true }, async () => {
      try {
        await this.doResetCache();
      } catch (err) {
        return Alert.alert(ALERT_TITLE_ERROR, ALERT_SETTINGS_RESET_CACHE_FAIL);
      } finally {
        this.setState({ isClearingCache: false });
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
        return NavigationService.navigate('Logout');
      } catch (err) {
        return Alert.alert(ALERT_TITLE_ERROR, ALERT_SETTINGS_DELETE_USER_FAIL);
      } finally {
        this.setState({ isDeletingAccount: false });
      }
    });
  }

  handleOnPressLogout = async () => NavigationService.navigate('Logout');

  handleOnPressUpgrade = () => {
    const { activeSubscriptionProductId } = this.props;

    const centeredSubscriptionProductId = (activeSubscriptionProductId === SUBSCRIPTION_FREE_SKU) ? SUBSCRIPTION_PREMIUM_SKU : SUBSCRIPTION_PLUS_SKU;

    NavigationService.navigate('Upgrade', {
      centeredSubscriptionProductId
    })
  }

  handleOnPressLanguage = () => {
    requestAnimationFrame(() => NavigationService.navigate('SettingsLanguages'));
  }

  handleOnPressAccountPassword = () => NavigationService.navigate('UpdatePassword');

  handleOnPressAccountEmail = () => NavigationService.navigate('UpdateEmail');

  handleOnPressAccountDelete = () => {
    return Alert.alert(ALERT_TITLE_REQUEST_CONFIRM, ALERT_SETTINGS_DELETE_USER, [
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

  renderDeleteAccount = () => {
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

  renderVersionInfo = () => {
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

  renderFooter = () => {
    return (
      <View>
        {this.renderVersionInfo()}
        {this.renderDeleteAccount()}
      </View>
    );
  }

  render() {
    const { activeSubscriptionName, totalAvailableVoices, user, activeSubscriptionProductId, userHasSubscribedBefore } = this.props;
    const { isClearingCache, cacheSize } = this.state;

    const sectionListData = [
      {
        key: 'language',
        title: 'Lanuage',
        data: [
          {
            key: 'language-voices-and-languguages',
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
        key: 'user',
        title: 'User',
        data: [
          {
            key: 'user-subscription',
            title: 'Subscription',
            icon: 'star',
            iconColor: colors.tintColor,
            onPress: this.handleOnPressUpgrade,
            chevron: true,
            value: activeSubscriptionName
          },
          {
            key: 'change-email',
            title: 'Change e-mail',
            icon: 'mail',
            iconColor: colors.tintColor,
            onPress: this.handleOnPressAccountEmail,
            chevron: true
          },
          {
            key: 'change-password',
            title: 'Change password',
            icon: 'lock',
            iconColor: colors.tintColor,
            onPress: this.handleOnPressAccountPassword,
            chevron: true
          },
          {
            key: 'logout',
            title: 'Logout',
            icon: 'log-out',
            iconColor: colors.tintColor,
            onPress: this.handleOnPressLogout,
            chevron: true
          }
        ]
      },
      {
        key: 'advanced',
        title: 'Advanced',
        data: [
          {
            key: 'clear-cache',
            title: 'Clear cache',
            icon: 'trash-2',
            iconColor: colors.red,
            onPress: this.handleOnPressClearCache,
            isLoading: isClearingCache,
            value: `${cacheSize} mb`,
            chevron: true
          }
        ]
      },
      {
        key: 'about',
        title: 'About',
        data: [
          {
            key: 'about-write-a-review',
            title: 'Write a review',
            icon: 'heart',
            iconColor: colors.green,
            chevron: true,
            onPress: () => Linking.openURL(URL_APP_APPLE_APP_STORE_REVIEW)
          },
          {
            key: 'about-about',
            title: 'About',
            icon: 'link',
            iconColor: colors.grayDark,
            chevron: true,
            onPress: () =>
              NavigationService.navigate('Browser', {
                url: URL_ABOUT,
                title: 'About'
              })
          },
          {
            key: 'about-privacy-policy',
            title: 'Privacy Policy',
            icon: 'link',
            iconColor: colors.grayDark,
            chevron: true,
            onPress: () =>
              NavigationService.navigate('Browser', {
                url: URL_PRIVACY_POLICY,
                title: 'Privacy Policy'
              })
          },
          {
            key: 'about-terms-of-use',
            title: 'Terms of Use',
            icon: 'link',
            iconColor: colors.grayDark,
            chevron: true,
            onPress: () =>
              NavigationService.navigate('Browser', {
                url: URL_TERMS_OF_USE,
                title: 'Terms of Use'
              })
          },
          {
            key: 'about-feedback',
            title: 'Feedback',
            icon: 'message-square',
            iconColor: colors.grayDark,
            chevron: true,
            onPress: () =>
              NavigationService.navigate('Browser', {
                url: URL_FEEDBACK,
                title: 'Feedback'
              })
          },
          {
            key: 'about-support',
            title: 'Support',
            icon: 'message-square',
            iconColor: colors.grayDark,
            chevron: true,
            onPress: () =>
              NavigationService.navigate('Browser', {
                url: URL_FEEDBACK,
                title: 'Support'
              })
          }
        ]
      }
    ];

    return (
      <CustomSectionList
        paddingTop={0}
        sectionListData={sectionListData}
        ListHeaderComponent={
          <View style={{ marginLeft: spacing.default * -1, marginRight: spacing.default * -1, marginBottom: spacing.small }}>
            <Usage
              user={user}
              activeSubscriptionProductId={activeSubscriptionProductId}
              onPressUpgrade={this.handleOnPressUpgrade}
              userHasSubscribedBefore={userHasSubscribedBefore}
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
  userHasSubscribedBefore: ReturnType<typeof selectUserHasSubscribedBefore>;
}

const mapStateToProps = (state: RootState) => ({
  user: selectUserDetails(state),
  isSubscribed: selectIsSubscribed(state),
  activeSubscriptionName: selectActiveSubscriptionName(state),
  activeSubscriptionProductId: selectActiveSubscriptionProductId(state),
  totalAvailableVoices: selectTotalAvailableVoices(state),
  userHasSubscribedBefore: selectUserHasSubscribedBefore(state),
});

const mapDispatchToProps = {
  resetAudiofilesState,
  resetVoicesState,
  resetDownloadedVoices,
  getUser,
  deleteUser
};

export const SettingsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsContainerComponent)
