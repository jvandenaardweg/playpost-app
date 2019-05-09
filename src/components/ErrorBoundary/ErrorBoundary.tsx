import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';

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
    // to prevent this alert blocking your view of a red screen while developing
    if (__DEV__) {
      return;
    }

    if (this.errorShown) {
      return;
    }

    this.errorShown = true;

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
