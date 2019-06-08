import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as Icon from '../Icon';

import colors from '../../constants/colors';

import styles from './styles';

interface Props {
  onPress(): void;
}

export const ButtonClose: React.FC<Props> = React.memo(({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container} testID="button-close">
      <Icon.Feather name="x" size={26} color={colors.black} />
    </TouchableOpacity>
  );
});
