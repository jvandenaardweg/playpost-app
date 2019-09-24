import { Linking } from 'react-native';
import InAppBrowser, { InAppBrowserOptions } from 'react-native-inappbrowser-reborn'
import colors from '../constants/colors';

export const openUrl = async (url: string, options?: InAppBrowserOptions | undefined) => {
  const isInAppBrowserAvailable = await InAppBrowser.isAvailable();

  if (!isInAppBrowserAvailable) {
    return Linking.openURL(url);
  }

  const defaultOptions = {
    dismissButtonStyle: 'close',
    preferredBarTintColor: colors.white,
    // preferredControlTintColor: 'white',
    readerMode: false,
    animated: true,
    modalPresentationStyle: 'overFullScreen',
    // modalTransitionStyle: 'partialCurl',
    modalEnabled: true,
    // Android Properties
    showTitle: true,
    // toolbarColor: '#6200EE',
    secondaryToolbarColor: colors.black,
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
