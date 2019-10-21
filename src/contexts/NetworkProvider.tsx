import NetInfo from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';

export const NetworkContext = React.createContext<{ isConnected: boolean }>({ isConnected: false });

export const NetworkConsumer = NetworkContext.Consumer;

interface State {
  isConnected?: boolean;
}

export const NetworkProvider: React.FC = React.memo((props) => {
  const [isConnected, setIsConnected] = useState<State['isConnected']>(false);

  useEffect(() => {
    const unsubscribeListener = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected)
    });

    return () => {
      if (unsubscribeListener) {
        unsubscribeListener();
      }
    }
  }, [])

  return (
    <NetworkContext.Provider value={{ isConnected: isConnected ? true : false }}>
      {props.children}
    </NetworkContext.Provider>
  );
})
