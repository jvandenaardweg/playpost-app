import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import colors from '../constants/colors';

export const CenterLoadingIndicator = () => (
  <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', backgroundColor: colors.appBackground, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <ActivityIndicator />
  </View>
);
