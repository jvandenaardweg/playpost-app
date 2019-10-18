import analytics from '@react-native-firebase/analytics';
import React from 'react';
import isEqual from 'react-fast-compare';
import { ActivityIndicator, Alert, InteractionManager, Linking, SectionListData, View } from 'react-native';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import { NavigationEventSubscription, NavigationInjectedProps, withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

import Text from '../components/Text';
import * as inAppBrowser from '../utils/in-app-browser';

import colors from '../constants/colors';

import {
  ALERT_SETTINGS_CLEAR_CACHE_WARNING,
  ALERT_SETTINGS_DELETE_USER,
  ALERT_SETTINGS_DELETE_USER_FAIL,
  ALERT_SETTINGS_DELETE_USER_SUBSCRIBED,
  ALERT_SETTINGS_RESET_CACHE_FAIL,
  ALERT_SETTINGS_SET_CACHE_SIZE_FAIL,
  ALERT_TITLE_ERROR,
  ALERT_TITLE_REQUEST_CONFIRM} from '../constants/messages';
import spacing from '../constants/spacing';
import { URL_ABOUT, URL_APP_REVIEW, URL_BROWSER_EXTENSION_CHROME, URL_BROWSER_EXTENSION_FIREFOX, URL_BROWSER_EXTENSION_OPERA, URL_FEEDBACK, URL_MANAGE_SUBSCRIPTIONS, URL_PLAYPOST_FOR_PUBLISHERS, URL_PRIVACY_POLICY, URL_TERMS_OF_USE } from '../constants/urls';

import { RootState } from '../reducers';
import { resetAudiofilesState } from '../reducers/audiofiles';
import { deleteUser, getUser, UserTheme } from '../reducers/user';
import { resetDownloadedVoices, resetVoicesState } from '../reducers/voices';

import { selectUserActiveSubscriptionName, selectUserActiveSubscriptionProductId, selectUserDetails, selectUserIsEligibleForTrial, selectUserIsSubscribed, selectUserSelectedTheme } from '../selectors/user';
import { selectTotalAvailableVoices } from '../selectors/voices';

import { CustomSectionList, IListItem } from '../components/CustomSectionList';
import { Usage } from '../components/Usage';

import * as cache from '../cache';
import { SUBSCRIPTION_PRODUCT_ID_FREE, SUBSCRIPTION_PRODUCT_ID_PREMIUM, SUBSCRIPTION_PRODUCT_ID_UNLIMITED } from '../constants/in-app-purchase';
import NavigationService from '../navigation/NavigationService';

import { UserThemeContext } from '../contexts/UserThemeProvider';


type Props = NavigationInjectedProps & DispatchProps & StateProps;

interface State {
  cacheSize: string;
  isClearingCache: boolean;
  isLoggingOut: boolean;
  isDeletingAccount: boolean;
  version: string;
  buildNumber: string;
}

export class SettingsContainerComponent extends React.Component<Props, State> {
  static contextType = UserThemeContext;

  state = {
    cacheSize: '0',
    isClearingCache: false,
    isLoggingOut: false,
    isDeletingAccount: false,
    version: '',
    buildNumber: ''
  };

  didFocusSubscription: NavigationEventSubscription | null = null;

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setVersionInfo();
      this.setCacheSize();

      // Getting the user details, but also the user's settings (for example: user selected voices)
      this.props.getUser();

      // Re-calculate the cache size every time the user goes to the settings screen
      this.didFocusSubscription = this.props.navigation.addListener(
        'didFocus',
        () => {
          this.setCacheSize();
          this.props.getUser();
        }
      );
    });
  }

  componentWillUnmount() {
    if (this.didFocusSubscription) {
      this.didFocusSubscription.remove()
      this.didFocusSubscription = null;
    }
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

  setVersionInfo = async () => {
    const version = await DeviceInfo.getVersion();
    const buildNumber = await DeviceInfo.getBuildNumber();

    return this.setState({ version, buildNumber });
  }

  setCacheSize = async () => {
    try {
      const sizeInMb = await cache.getCacheSizeInMb();
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

    await cache.emptyAllCaches();

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

  handleOnPressUpgrade = async () => {
    const { activeSubscriptionProductId } = this.props;

    const centeredSubscriptionProductId = (activeSubscriptionProductId === SUBSCRIPTION_PRODUCT_ID_FREE) ? SUBSCRIPTION_PRODUCT_ID_PREMIUM : SUBSCRIPTION_PRODUCT_ID_UNLIMITED;

    NavigationService.navigate('Upgrade', {
      centeredSubscriptionProductId
    })

    await analytics().logEvent('settings_press_upgrade', {
      centeredSubscriptionProductId
    })
  }

  handleOnPressLanguage = () => {
    requestAnimationFrame(() => NavigationService.navigate('SettingsLanguages'));
  }

  handleOnPressAccountPassword = () => NavigationService.navigate('UpdatePassword');

  handleOnPressAccountEmail = () => NavigationService.navigate('UpdateEmail');

  handleOnPressAccountDelete = () => {
    const { isSubscribed } = this.props;

    if (isSubscribed) {
      return Alert.alert(ALERT_TITLE_REQUEST_CONFIRM, ALERT_SETTINGS_DELETE_USER_SUBSCRIBED, [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Manage Subscriptions',
          onPress: () => Linking.openURL(URL_MANAGE_SUBSCRIPTIONS)
        },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: () => this.deleteAccount()
        }
      ]);
    }

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

  handleOnPressChangeTheme = () => {
    NavigationService.navigate('SettingsTheme')
  }

  renderDeleteAccount = () => {
    const { isDeletingAccount } = this.state;

    if (isDeletingAccount) {
      return <ActivityIndicator size="small" color="black" />;
    }

    return (
      <Text
        style={{
          alignSelf: 'center',
          color: colors.red,
          marginBottom: 40
        }}
        onPress={this.handleOnPressAccountDelete}
      >
        Delete account
      </Text>
    );
  }

  renderFooter = () => {
    const { version, buildNumber } = this.state;

    const environment = Config.NODE_ENV;
    const environmentText = environment !== 'production' ? `(Env: ${environment})` : '';

    const versionText = `Version: ${version} (${buildNumber}) ${environmentText}`;

    return (
      <View>
        <Text
          style={{
            alignSelf: 'center',
            color: colors.gray100,
            marginBottom: 40,
            marginTop: spacing.large
          }}
        >
          {versionText}
        </Text>
        {this.renderDeleteAccount()}
      </View>
    );
  }

  render() {
    const { activeSubscriptionName, totalAvailableVoices, user, activeSubscriptionProductId, userIsEligibleForTrial, userSelectedTheme } = this.props;
    const { isClearingCache, cacheSize } = this.state;

    const userEmail = user && user.email;
    const userId = user && user.id;

    const sectionListData: ReadonlyArray<SectionListData<IListItem>> = [
      {
        key: 'user-settings',
        title: 'Settings',
        data: [
          {
            key: 'user-language-voices-and-languguages',
            title: 'Voices & Languages',
            icon: 'globe',
            iconColor: colors.green,
            onPress: this.handleOnPressLanguage,
            value: totalAvailableVoices,
            chevron: true
          },
          {
            key: 'user-theme',
            title: 'Theme',
            icon: (userSelectedTheme === UserTheme.light) ? 'sun' : (userSelectedTheme === UserTheme.dark) ? 'moon' : 'clock',
            iconColor: colors.green,
            onPress: this.handleOnPressChangeTheme,
            chevron: true,
            value: userSelectedTheme[0].toUpperCase() + userSelectedTheme.slice(1)
          },
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
            title: 'Rate us 5 stars',
            icon: 'heart',
            iconColor: colors.green,
            chevron: true,
            onPress: () => Linking.openURL(URL_APP_REVIEW)
          },
          {
            key: 'about-for-publishers',
            title: 'For publishers',
            icon: 'file-text',
            iconColor: colors.gray100,
            chevron: true,
            onPress: () => inAppBrowser.openUrl(URL_PLAYPOST_FOR_PUBLISHERS, userSelectedTheme)
          },
          {
            key: 'about-chrome-browser-extension',
            title: 'Chrome browser extension',
            icon: 'package',
            iconColor: colors.gray100,
            chevron: true,
            onPress: () => inAppBrowser.openUrl(URL_BROWSER_EXTENSION_CHROME, userSelectedTheme)
          },
          {
            key: 'about-firefox-browser-extension',
            title: 'Firefox browser extension',
            icon: 'package',
            iconColor: colors.gray100,
            chevron: true,
            onPress: () => inAppBrowser.openUrl(URL_BROWSER_EXTENSION_FIREFOX, userSelectedTheme)
          },
          {
            key: 'about-opera-browser-extension',
            title: 'Opera browser extension',
            icon: 'package',
            iconColor: colors.gray100,
            chevron: true,
            onPress: () => inAppBrowser.openUrl(URL_BROWSER_EXTENSION_OPERA, userSelectedTheme)
          },
          {
            key: 'about-about',
            title: 'About',
            icon: 'link',
            iconColor: colors.gray100,
            chevron: true,
            onPress: () => inAppBrowser.openUrl(URL_ABOUT, userSelectedTheme)
          },
          {
            key: 'about-privacy-policy',
            title: 'Privacy Policy',
            icon: 'link',
            iconColor: colors.gray100,
            chevron: true,
            onPress: () => inAppBrowser.openUrl(URL_PRIVACY_POLICY, userSelectedTheme)
          },
          {
            key: 'about-terms-of-use',
            title: 'Terms of Use',
            icon: 'link',
            iconColor: colors.gray100,
            chevron: true,
            onPress: () => inAppBrowser.openUrl(URL_TERMS_OF_USE, userSelectedTheme)
          },
          {
            key: 'about-feedback',
            title: 'Feedback',
            icon: 'message-square',
            iconColor: colors.gray100,
            chevron: true,
            onPress: () => inAppBrowser.openUrl(URL_FEEDBACK + `?email=${userEmail}&id=${userId}`, userSelectedTheme, { modalEnabled: false })
          },
          {
            key: 'about-support',
            title: 'Support',
            icon: 'message-square',
            iconColor: colors.gray100,
            chevron: true,
            onPress: () => inAppBrowser.openUrl(URL_FEEDBACK + `?email=${userEmail}&id=${userId}`, userSelectedTheme, { modalEnabled: false })
          }
        ]
      }
    ];

    return (
      <CustomSectionList
        paddingTop={0}
        sectionListData={sectionListData}
        ListHeaderComponent={
          <Usage
            user={user}
            activeSubscriptionProductId={activeSubscriptionProductId}
            onPressUpgrade={this.handleOnPressUpgrade}
            userIsEligibleForTrial={userIsEligibleForTrial}
          />
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
  isSubscribed: ReturnType<typeof selectUserIsSubscribed>;
  activeSubscriptionName: ReturnType<typeof selectUserActiveSubscriptionName>;
  activeSubscriptionProductId: ReturnType<typeof selectUserActiveSubscriptionProductId>;
  totalAvailableVoices: ReturnType<typeof selectTotalAvailableVoices>;
  userIsEligibleForTrial: ReturnType<typeof selectUserIsEligibleForTrial>;
  userSelectedTheme: ReturnType<typeof selectUserSelectedTheme>;
}

const mapStateToProps = (state: RootState) => ({
  user: selectUserDetails(state),
  isSubscribed: selectUserIsSubscribed(state),
  activeSubscriptionName: selectUserActiveSubscriptionName(state),
  activeSubscriptionProductId: selectUserActiveSubscriptionProductId(state),
  totalAvailableVoices: selectTotalAvailableVoices(state),
  userIsEligibleForTrial: selectUserIsEligibleForTrial(state),
  userSelectedTheme: selectUserSelectedTheme(state),
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
)(withNavigation(SettingsContainerComponent))
