import React from 'react';
import { TouchableOpacity } from 'react-native';

import * as Icon from '../Icon';

import colors from '../../constants/colors';

import styles from './styles';

interface Props {
  onPress(): void;
}

export const ButtonVoices: React.FC<Props> = React.memo(({ onPress }) => {
  return (
    <TouchableOpacity testID="ButtonVoices-button" onPress={onPress} style={styles.container}>
      <Icon.Feather name="radio" size={24} color={colors.green} style={styles.icon} />
    </TouchableOpacity>
  );
});
