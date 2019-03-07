import React from 'react';
import { Alert } from 'react-native';
import RNRestart from 'react-native-restart';
import Analytics from 'appcenter-analytics';

interface State {
  hasError: boolean
}

interface Props {
  children: any
}

export class ErrorBoundary extends React.PureComponent<Props, State> {

  state = {
    hasError: false
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.log(error, info)
    // to prevent this alert blocking your view of a red screen while developing
    if (__DEV__) {
      return;
    }

    // You can also log the error to an error reporting service
    if (error) {
      Analytics.trackEvent('App error', { error });
    }

    if (info) {
      Analytics.trackEvent('App info', { info });
    }

    Alert.alert(
      'Oops! Something went wrong...',
      'Please restart the app to continue.',
      [
        {
          text: 'Restart app',
          onPress: RNRestart.Restart,
        },
      ],
      { cancelable: false }
    );
  }

  render() {
    // if (this.state.hasError) {
    //   // Render any custom fallback UI
    //   return <View style={{ flex: 1 }}><Text>Something went wrong.</Text></View>;
    // }

    return this.props.children;
  }
}
