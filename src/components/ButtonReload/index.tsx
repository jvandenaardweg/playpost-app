import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as Icon from '../Icon';

import colors from '../../constants/colors';

import styles from './styles';

interface Props {
  onPress(): void;
}

export const ButtonReload: React.FC<Props> = React.memo(({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Icon.Feather name="refresh-ccw" size={20} color={colors.tintColor} />
    </TouchableOpacity>
  );
});
