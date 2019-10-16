import React, { useContext } from 'react';

import * as Icon from '../../components/Icon';
import colors from '../../constants/colors';
import { UserThemeContext } from '../../contexts/UserThemeProvider';
import { UserTheme } from '../../reducers/user';

interface Props {
  focused: boolean;
  name: string;
}

export const TabBarIcon: React.FC<Props> = React.memo(({ focused, name }) => {
  const { theme } = useContext(UserThemeContext);
  const colorFocusedLight = focused ? colors.tabIconSelected : colors.tabIconDefault;
  const colorFocusedDark = focused ? colors.white : colors.grayDarker;
  const color = theme === UserTheme.dark ? colorFocusedDark : colorFocusedLight

  return (
    <Icon.Feather
      name={name}
      size={24}
      color={color}
    />
  );
});
