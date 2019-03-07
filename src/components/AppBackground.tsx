import React from 'react';
import { View } from 'react-native';

import colors from '../constants/colors';

interface Props {
  children: any
}

export const AppBackground = (props: Props) => (
  <View style={{ backgroundColor: colors.appBackground, flex: 1 }}>
    {props.children}
  </View>
);
