import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn'
import colors from '../constants/colors';

export const openUrl = async (url: string) => {
  const isInAppBrowserAvailable = await InAppBrowser.isAvailable();

  if (!isInAppBrowserAvailable) {
    return Linking.openURL(url);
  }

  const result = await InAppBrowser.open(url, {
    // iOS Properties

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
  })

  return result;
}
