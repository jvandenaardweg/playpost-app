import React, { useContext } from 'react';

import * as Icon from '../../components/Icon';
import colors from '../../constants/colors';
import { UserThemeContext } from '../../contexts/UserThemeProvider';
import { UserTheme } from '../../reducers/user';

interface Props {
  focused: boolean;
  name: string;
}

export const TabBarIcon: React.FC<Props> = React.memo((props) => {
  const { theme } = useContext(UserThemeContext);

  const colorFocusedLight = props.focused ? colors.tabIconSelected : colors.tabIconDefault;
  const colorFocusedDark = props.focused ? colors.white : colors.gray400;
  const color = theme === UserTheme.dark ? colorFocusedDark : colorFocusedLight;

  return (
    <Icon.Feather
      name={props.name}
      size={24}
      color={color}
    />
  );
});
