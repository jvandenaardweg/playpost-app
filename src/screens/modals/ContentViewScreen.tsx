// import analytics from '@react-native-firebase/analytics';
import React, { useContext } from 'react';
import { NavigationRoute, NavigationScreenComponent, NavigationScreenProp } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';

import { ContentView } from '../../components/ContentView';
import { URL_FEEDBACK } from '../../constants/urls';
import { UserThemeContext } from '../../contexts/UserThemeProvider';
import * as inAppBrowser from '../../utils/in-app-browser';

export const ContentViewScreen: NavigationScreenComponent<{}, NavigationScreenProp<NavigationRoute>> = React.memo(() => {
  const { theme } = useContext(UserThemeContext);

  const handleOnPressSupport = () => {
    inAppBrowser.openUrl(URL_FEEDBACK, theme, { modalEnabled: false });
  }

  return (
    <ContentView onPressSupport={handleOnPressSupport} />
  );
})

ContentViewScreen.navigationOptions = (): NavigationStackOptions => {
  return {
    headerLeft: () => null
  };
}
