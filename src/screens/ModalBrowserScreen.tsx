// @ts-ignore
import React from 'react';
import { NavigationScreenProp, NavigationRoute, NavigationStackScreenOptions } from 'react-navigation';
import { WebView } from 'react-native-webview';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class ModalBrowserScreen extends React.PureComponent<Props> {

  /* tslint:disable-next-line no-any */
  private webviewRef = React.createRef<any>();

  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: navigation.getParam('title', null)
    };
  }

  render() {
    const url = this.props.navigation.getParam('url', null);

    return (
      <WebView
        ref={this.webviewRef}
        source={{ uri: url }}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        incognito={false}
      />
    );
  }
}
