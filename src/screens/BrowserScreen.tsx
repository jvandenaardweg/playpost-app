// @ts-ignore
import React from 'react';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { WebView } from 'react-native-webview';

import { ButtonReload } from '../components/Header';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class BrowserScreen extends React.PureComponent<Props> {

  /* tslint:disable-next-line no-any */
  private webviewRef = React.createRef<any>();

  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }) => {
    return {
      title: navigation.getParam('title', null),
      headerRight: <ButtonReload onPress={navigation.getParam('handleOnReload')} />
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleOnReload: this.handleOnReload });
  }

  handleOnReload = () => {
    this.webviewRef.current && this.webviewRef.current.reload();
  }

  render() {
    const url = this.props.navigation.getParam('url', null);

    return (
      <WebView
        ref={this.webviewRef}
        source={{ uri: url }}
        startInLoadingState={true}
        useWebKit={true}
       />
    );
  }
}
