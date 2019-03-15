
import React from 'react';
import { View } from 'react-native';

// BottomTabBar not seems to be in the exported types, but is available to import
// So we ignore the error for now
// Using this BottomTabBar, instead of the one from react-native-tabs also makes sure it just works
// react-native-tabs does not seem to work properly with the documentation provided
// @ts-ignore
import { BottomTabBar } from 'react-navigation';

import { AudioPlayerContainer } from '../../components/AudioPlayer';

import styles from './styles';
import { ErrorMessage } from '../ErrorMessage';
import { OfflineNotice } from '../OfflineNotice';

export const TabBar: React.FC = React.memo((props: any) => (
  <View style={styles.container}>
    <OfflineNotice />
    <ErrorMessage />
    <AudioPlayerContainer />
    <BottomTabBar {...props} />
  </View>
));
