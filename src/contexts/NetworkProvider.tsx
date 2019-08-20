import NetInfo, { NetInfoSubscription } from '@react-native-community/netinfo';
import React from 'react';
import { InteractionManager } from 'react-native';

export const NetworkContext = React.createContext<{ isConnected: boolean }>({ isConnected: false });

export const NetworkConsumer = NetworkContext.Consumer;

interface State {
  isConnected?: boolean;
}

export class NetworkProvider extends React.PureComponent<State> {
  state = {
    isConnected: false
  };

  unsubscribeListener: NetInfoSubscription | null = null;

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.unsubscribeListener = NetInfo.addEventListener((state) => {
        this.setState({ isConnected: state.isConnected });
      });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribeListener) {
      this.unsubscribeListener();
      this.unsubscribeListener = null;
    }
  }

  render() {
    return (
      <NetworkContext.Provider value={this.state}>
        {this.props.children}
      </NetworkContext.Provider>
    );
  }
}
