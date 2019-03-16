import React, { ReactNode } from 'react';
import { Alert, View, Text } from 'react-native';
import RNRestart from 'react-native-restart';

interface State {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  hasError: boolean;
}

interface Props {
  children: ReactNode;
}

export class ErrorBoundary extends React.Component<Props, State> {

  state = {
    error: null,
    errorInfo: null,
    hasError: false
  };

  errorShown = false;

  // static getDerivedStateFromError(error: any) {
  //   // Update state so the next render will show the fallback UI.
  //   return { hasError: true };
  // }

  // static getDerivedStateFromError(error) {
  //   // Update state so the next render will show the fallback UI.
  //   return { hasError: true };
  // }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('ERORROR!', error, errorInfo);
    // to prevent this alert blocking your view of a red screen while developing
    if (__DEV__) {
      return;
    }

    if (this.errorShown) {
      return;
    }

    this.errorShown = true;

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

    // this.setState({ error, errorInfo });

    // You can also log the error to an error reporting service
    // if (error) {
    //   Analytics.trackEvent('App error', { error });
    // }

    // if (errorInfo) {
    //   Analytics.trackEvent('App errorInfo', { errorInfo });
    // }

  }

  render() {
    if (this.errorShown) {
      // Render any custom fallback UI
      return <View style={{ flex: 1 }}><Text>Something went wrong.</Text></View>;
    }

    return this.props.children;
  }
}
