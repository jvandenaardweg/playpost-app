import React from 'react';
import NetInfo, { NetInfoSubscription } from '@react-native-community/netinfo';

export const NetworkContext = React.createContext<{ isConnected: boolean }>({ isConnected: false });

export const NetworkConsumer = NetworkContext.Consumer;

interface State {
  isConnected?: boolean;
}

export class NetworkProvider extends React.PureComponent<State> {
  state = {
    isConnected: false
  };

  unsubscribe: NetInfoSubscription | null = null;

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener((state) => {
      this.setState({ isConnected: state.isConnected });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
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
