import React from 'react';
import NetInfo from '@react-native-community/netinfo';

export const NetworkContext = React.createContext<{ isConnected: boolean }>({ isConnected: true });

export const NetworkConsumer = NetworkContext.Consumer;

interface State {
  isConnected?: boolean;
}

export class NetworkProvider extends React.PureComponent<State> {
  state = {
    isConnected: true,
  };

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = (isConnected: boolean) => this.setState({ isConnected });

  render() {
    return (
      <NetworkContext.Provider value={this.state}>
        {this.props.children}
      </NetworkContext.Provider>
    );
  }
}
