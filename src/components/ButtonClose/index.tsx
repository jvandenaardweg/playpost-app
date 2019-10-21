import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import * as Icon from '../Icon';

import colors from '../../constants/colors';

import { mediumHitslop } from '../../constants/buttons';
import { UserThemeContext } from '../../contexts/UserThemeProvider';
import { UserTheme } from '../../reducers/user';
import styles from './styles';

interface Props {
  theme: 'light' | 'dark';
  iconColor?: string;
  onPress(): void;
}

export const ButtonClose: React.FC<Props> = React.memo((props) => {
  const { theme } = useContext(UserThemeContext);

  const buttonStyle = (theme === UserTheme.dark) ? { backgroundColor: colors.gray700 } : { backgroundColor: colors.grayLight }

  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{ ...styles(theme).container, ...buttonStyle }}
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
