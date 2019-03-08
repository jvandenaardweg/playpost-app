
import React from 'react';
import { View } from 'react-native';
import { BottomTabBar } from 'react-navigation-tabs';

import { AudioPlayerContainer } from '../../containers/AudioPlayerContainer';

import styles from './styles';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

export const TabBar = (props: any) => (
  <View style={styles.container}>
    <ErrorMessage />
    <AudioPlayerContainer />
    <BottomTabBar {...props} />
  </View>
);
