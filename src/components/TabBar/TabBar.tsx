
import React from 'react';
import { View } from 'react-native';
import { BottomTabBar } from 'react-navigation-tabs';

import { AudioPlayerContainer } from '../../containers/AudioPlayerContainer';

import styles from './styles';

export const TabBar = (props: any) => (
  <View style={styles.container}>
    <AudioPlayerContainer />
    <BottomTabBar {...props} />
  </View>
);
