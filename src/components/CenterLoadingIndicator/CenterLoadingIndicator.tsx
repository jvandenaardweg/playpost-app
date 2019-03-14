import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import colors from '../../constants/colors';

import styles from './styles';

interface Props {
  backgroundColor?: string;
}

export const CenterLoadingIndicator: React.FC<Props>  = React.memo(({ backgroundColor }: Props) => (
  <View style={[styles.container, { backgroundColor: (backgroundColor) ? backgroundColor : colors.appBackground }]}>
    <ActivityIndicator />
  </View>
));
