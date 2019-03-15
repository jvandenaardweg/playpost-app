import React from 'react';
import NetInfo from '@react-native-community/netinfo';

export const NetworkContext = React.createContext({ isConnected: true });

export const NetworkConsumer = NetworkContext.Consumer;

interface State {
  isConnected?: boolean;
  // connectionType?: ConnectionType;
  // effectiveConnectionType?: EffectiveConnectionType;
}

export class NetworkProvider extends React.PureComponent<State> {
  state = {
    isConnected: true,
    // connectionType: null,
    // effectiveConnectionType: null
  };

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    // NetInfo.addEventListener('connectionChange', this.handleConnectionChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    // NetInfo.removeEventListener('connectionChange', this.handleConnectionChange);
  }

  // handleConnectionChange = (result: ConnectionInfo) => this.setState({ connectionType: result.type, effectiveConnectionType: result.effectiveType });

  handleConnectivityChange = (isConnected: boolean) => this.setState({ isConnected });

  render() {
    return (
      <NetworkContext.Provider value={this.state}>
        {this.props.children}
      </NetworkContext.Provider>
    );
  }
}
