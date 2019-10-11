import React, { useContext } from 'react';
import { View } from 'react-native';

import { NetworkContext } from '../../contexts/NetworkProvider';

// BottomTabBar not seems to be in the exported types, but is available to import
// So we ignore the error for now
// Using this BottomTabBar, instead of the one from react-native-tabs also makes sure it just works
// react-native-tabs does not seem to work properly with the documentation provided
// @ts-ignore
import { BottomTabBar, BottomTabBarProps } from 'react-navigation-tabs';

import { SmallAudioPlayerContainer } from '../../containers/SmallAudioPlayerContainer';

import colors from '../../constants/colors';
import { GlobalStatusIndicatorContainer } from '../../containers/GlobalStatusIndicatorContainer';
import { OfflineNotice } from '../OfflineNotice';
import styles from './styles';

export const TabBar: React.FC<BottomTabBarProps> = React.memo((
  props: BottomTabBarProps
) => {
  const { isConnected } = useContext(NetworkContext);

  return (
    <View style={styles.container}>
      {!isConnected && <OfflineNotice />}
      <GlobalStatusIndicatorContainer />
      <SmallAudioPlayerContainer />
      <BottomTabBar {...props} style={{ backgroundColor: colors.tabBarBackgroundColor, borderTopColor: colors.tabBarBorderColor }} />
    </View>
  );
});
