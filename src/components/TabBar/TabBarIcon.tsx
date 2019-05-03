import React from 'react';

import * as Icon from '../../components/Icon';
import colors from '../../constants/colors';

interface Props {
  focused: boolean;
  name: string;
}

export const TabBarIcon: React.FC<Props> = React.memo(({ focused, name }) => {
  const color = focused ? colors.white : colors.grayDarker;

  return (
    <Icon.Feather
      name={name}
      size={24}
      color={color}
    />
  );
});
