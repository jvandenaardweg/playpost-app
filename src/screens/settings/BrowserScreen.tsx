// @ts-ignore
import React from 'react';
import { Animated, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { NavigationRoute, NavigationScreenProp, NavigationStackScreenOptions } from 'react-navigation';

import { ButtonReload } from '../../components/ButtonReload';

import colors from '../../constants/colors';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

interface State {
  loadProgress: string;
}

export class BrowserScreen extends React.PureComponent<Props, State> {

  public static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: navigation.getParam('title', null),
      headerRight: <ButtonReload onPress={navigation.getParam('handleOnReload')} />
    };
  }

  public animatedWidth = new Animated.Value(0);

  public interpolatedWidth = this.animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  public state = {
    loadProgress: ''
  };

  /* tslint:disable-next-line no-any */
  private webviewRef = React.createRef<any>();

  public componentDidMount() {
    this.props.navigation.setParams({ handleOnReload: this.handleOnReload });
  }

  public handleOnReload = () => this.webviewRef.current && this.webviewRef.current.reload()

  public handleOnLoadEnd = () => {
    this.animatedWidth.setValue(0);
  }

  // TODO: fix no any
  /* tslint:disable no-any */
  public handleOnLoadProgress = (event: any) => {
    Animated.timing(
      this.animatedWidth,
      {
        toValue: event.nativeEvent.progress,
        duration: 300
      }
    ).start();
  }

  public render() {
    const url = this.props.navigation.getParam('url', null);

    return (
      <View style={{ flex: 1, backgroundColor: colors.appBackground }}>
        <Animated.View style={{ position: 'absolute', top: 0, left: 0, width: this.interpolatedWidth, backgroundColor: colors.tintColor, height: 5 }}></Animated.View>
        <WebView
          ref={this.webviewRef}
          source={{ uri: url }}
          startInLoadingState={true}
          // onLoadProgress={this.handleOnLoadProgress}
          // onLoadEnd={this.handleOnLoadEnd}
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
          incognito={false}
          decelerationRate="normal"
        />
      </View>

    );
  }
}
