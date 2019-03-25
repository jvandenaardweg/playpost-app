// @ts-ignore
import React from 'react';
import { View, Animated } from 'react-native';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { WebView } from 'react-native-webview';

import { ButtonReload } from '../components/Header';

import colors from '../constants/colors';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

interface State {
  loadProgress: string;
}

export class BrowserScreen extends React.PureComponent<Props, State> {

  /* tslint:disable-next-line no-any */
  private webviewRef = React.createRef<any>();

  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }) => {
    return {
      title: navigation.getParam('title', null),
      headerRight: <ButtonReload onPress={navigation.getParam('handleOnReload')} />
    };
  }

  widthAnimation = new Animated.Value(0);

  state = {
    loadProgress: ''
  };

  componentDidMount() {
    this.props.navigation.setParams({ handleOnReload: this.handleOnReload });
  }

  handleOnReload = () => {
    this.widthAnimation = new Animated.Value(0);
    this.webviewRef.current && this.webviewRef.current.reload();
  }

  handleOnLoadProgress = (event: any) => {
    console.log(event.nativeEvent.progress);
    Animated.timing(
      this.widthAnimation,
      {
        toValue: event.nativeEvent.progress,
        duration: 200
      }
    ).start();
  }

  render() {
    const url = this.props.navigation.getParam('url', null);

    const animatedWidth = this.widthAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

    return (
      <View style={{ flex: 1 }}>
        <Animated.View style={{ position: 'absolute', top: 0, left: 0, width: animatedWidth, backgroundColor: colors.tintColor, height: 5 }}></Animated.View>
        <WebView
          ref={this.webviewRef}
          source={{ uri: url }}
          // startInLoadingState={false}
          // onLoadProgress={this.handleOnLoadProgress}
          // useWebKit={true}
        />
      </View>

    );
  }
}
