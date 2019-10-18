import React, { ReactNode } from 'react';
import { Alert } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { ALERT_TITLE_ERROR } from '../../constants/messages';

interface Props {
  children: ReactNode
}

interface State {
  errorShown: boolean;
}

export class ErrorBoundary extends React.PureComponent<Props, State> {
  state = {
    errorShown: false
  }

  componentDidCatch(error: any, info: any) {
    // Do not show an alert when in develop mode
    // Here we want to have React Native's red screen
    if (__DEV__) {
      return;
    }

    // to prevent multiple alerts shown to your users
    if (this.state.errorShown) {
      return;
    }

    this.setState({ errorShown: true });

    // Always hide the splash screen
    // An error could appear on startup
    // When we do not hide the splashscreen, our Alert won't show
    SplashScreen.hide();

    // Show the alert to the user
    Alert.alert(
      ALERT_TITLE_ERROR,
      `An unexpected error has occurred. Please close and restart the app.\n\n${error}`,
      [
        {
          style: 'cancel',
          text: 'OK',
          onPress: () => this.setState({ errorShown: false }),
        },
      ],
      { cancelable: false }
    );
  }

  render() {
    return this.props.children;
  }
}
