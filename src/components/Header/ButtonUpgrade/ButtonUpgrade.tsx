import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import colors from '../../../constants/colors';

import styles from './styles';

interface Props {
  onPress(): void;
}

export const ButtonUpgrade: React.FC<Props> = React.memo(({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.label}>Upgrade</Text>
      <Icon name="star" solid size={16} color={colors.tintColor} style={styles.icon} />
    </TouchableOpacity>
  );
});
