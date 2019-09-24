import Analytics from 'appcenter-analytics';
import React from 'react';
import { NavigationRoute, NavigationScreenOptions, NavigationScreenProp } from 'react-navigation';

import { ContentView } from '../../components/ContentView';
import { URL_FEEDBACK } from '../../constants/urls';
import * as inAppBrowser from '../../utils/in-app-browser';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class ContentViewScreen extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationScreenOptions => {
    return {
      headerLeft: null
    };
  }

  handleOnPressSupport = () => {
    Analytics.trackEvent('ContentView Support Pressed');
    inAppBrowser.openUrl(URL_FEEDBACK, { modalEnabled: false });
  }

  render() {
    return (
      <ContentView onPressSupport={this.handleOnPressSupport} />
    );
  }
}
