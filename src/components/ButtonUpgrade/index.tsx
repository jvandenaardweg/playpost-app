import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import * as Icon from '../Icon';

import colors from '../../constants/colors';

import styles from './styles';

interface Props {
  onPress(): void;
}

export const ButtonUpgrade: React.FC<Props> = React.memo(({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.label}>Upgrade</Text>
      <Icon.FontAwesome5 name="star" solid size={16} color={colors.tintColor} style={styles.icon} />
    </TouchableOpacity>
  );
});
