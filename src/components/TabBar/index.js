
import React from 'react';
import { View } from 'react-native';
import { BottomTabBar } from 'react-navigation';
import { AudioPlayerContainer } from '../../containers/AudioPlayerContainer';
import styles from './styles';

export const TabBar = (props) => (
  <View style={styles.container}>
    <AudioPlayerContainer />
    <BottomTabBar {...props} />
  </View>
);
