import { Linking } from 'react-native';
import InAppBrowser, { InAppBrowserOptions } from 'react-native-inappbrowser-reborn'
import colors from '../constants/colors';
import { UserTheme } from '../reducers/user';

export const openUrl = async (url: string, theme: UserTheme, options?: InAppBrowserOptions | undefined) => {
  const isInAppBrowserAvailable = await InAppBrowser.isAvailable();

  if (!isInAppBrowserAvailable) {
    return Linking.openURL(url);
  }

  const defaultOptions = {
    dismissButtonStyle: 'close',
    preferredBarTintColor: (theme === UserTheme.dark) ? colors.black : colors.white,
    readerMode: false,
    animated: true,
    modalPresentationStyle: 'overFullScreen',
    modalEnabled: true,
    // Android Properties
    showTitle: true,
    // toolbarColor: '#6200EE',
    secondaryToolbarColor: (theme === UserTheme.dark) ? colors.white : colors.black,
    enableUrlBarHiding: true,
    enableDefaultShare: true,
    forceCloseOnRedirection: false,
    waitForRedirectDelay: 0
  }

  const inAppBrowserOptions = {
    ...defaultOptions,
    ...options
  }

  const result = await InAppBrowser.open(url, inAppBrowserOptions)

  return result;
}
