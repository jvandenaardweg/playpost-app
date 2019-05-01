import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import colors from '../../../constants/colors';

import styles from './styles';

interface Props {
  onPress(): void;
}

export const ButtonClose: React.FC<Props> = React.memo(({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Icon name="x" size={26} color={colors.black} />
    </TouchableOpacity>
  );
});
