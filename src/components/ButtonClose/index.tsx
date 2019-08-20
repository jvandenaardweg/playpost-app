import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as Icon from '../Icon';

import colors from '../../constants/colors';

import { mediumHitslop } from '../../constants/buttons';
import styles from './styles';

interface Props {
  iconColor?: string;
  onPress(): void;
}

export const ButtonClose: React.FC<Props> = React.memo(({ onPress, iconColor }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container} testID="button-close" hitSlop={mediumHitslop}>
      <Icon.Feather name="x" size={26} color={(iconColor) ? iconColor : colors.black} />
    </TouchableOpacity>
  );
});
