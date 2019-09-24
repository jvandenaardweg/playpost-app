import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as Icon from '../Icon';

import colors from '../../constants/colors';

import { mediumHitslop } from '../../constants/buttons';
import styles from './styles';

interface Props {
  theme: 'light' | 'dark';
  iconColor?: string;
  onPress(): void;
}

export const ButtonClose: React.FC<Props> = React.memo(({ theme = 'light', onPress, iconColor }) => {
  const buttonStyle = (theme === 'light') ? { backgroundColor: colors.grayLightest } : { backgroundColor: colors.grayDarkest }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...styles.container, ...buttonStyle }}
      testID="button-close"
      hitSlop={mediumHitslop}
    >
      <Icon.Feather
        name="x"
        size={18}
        color={(theme === 'light') ? colors.black : colors.white}
        style={{ width: 18, height: 18 }}
      />
    </TouchableOpacity>
  );
});
