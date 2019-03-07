import React from 'react';
import { View } from 'react-native';

import colors from '@/constants/colors';

export const AppBackground = (props) => (
  <View style={{ backgroundColor: colors.appBackground, flex: 1 }}>
    {props.children}
  </View>
);
