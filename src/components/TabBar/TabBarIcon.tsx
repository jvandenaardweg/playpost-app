import React from 'react';
import Icon from 'react-native-vector-icons/Feather';

import colors from '../../constants/colors';

interface Props {
  focused: boolean;
  name: string;
}

export const TabBarIcon: React.FC<Props> = React.memo(({ focused, name }) => {
  const color = focused ? colors.tabIconSelected : colors.tabIconDefault;

  return (
    <Icon
      name={name}
      size={24}
      style={{ marginBottom: -2 }}
      color={color}
    />
  );
});
