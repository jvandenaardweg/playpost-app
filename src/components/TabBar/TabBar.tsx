
import React from 'react';
import { View } from 'react-native';

// BottomTabBar not seems to be in the exported types, but is available to import
// So we ignore the error for now
// Using this BottomTabBar, instead of the one from react-native-tabs also makes sure it just works
// react-native-tabs does not seem to work properly with the documentation provided
// @ts-ignore
import { BottomTabBar, BottomTabBarProps } from 'react-navigation';

import { AudioPlayerContainer } from '../../components/AudioPlayer';

import styles from './styles';
import { ErrorMessage } from '../ErrorMessage';
import { OfflineNotice } from '../OfflineNotice';
import colors from '../../constants/colors';

export const TabBar: React.FC<BottomTabBarProps> = React.memo(props => (
  <View style={styles.container}>
    <OfflineNotice />
    <ErrorMessage />
    <AudioPlayerContainer />
    <BottomTabBar style={{backgroundColor: 'black', borderTopWidth: 1, borderTopColor: colors.grayDarkest }} {...props} />
  </View>
));
