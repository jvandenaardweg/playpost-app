import NetInfo, { NetInfoSubscription } from '@react-native-community/netinfo';
import React from 'react';

export const NetworkContext = React.createContext<{ isConnected: boolean }>({ isConnected: false });

export const NetworkConsumer = NetworkContext.Consumer;

interface State {
  isConnected?: boolean;
}

export class NetworkProvider extends React.PureComponent<State> {
  public state = {
    isConnected: false
  };

  public unsubscribe: NetInfoSubscription | null = null;

  public componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener((state) => {
      this.setState({ isConnected: state.isConnected });
    });
  }

  public componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  public render(): JSX.Element {
    return (
      <NetworkContext.Provider value={this.state}>
        {this.props.children}
      </NetworkContext.Provider>
    );
  }
}
