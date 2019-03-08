import * as React from 'React';
import Icon from 'react-native-vector-icons/Feather';

import colors from '../../constants/colors';

interface Props {
  focused: boolean;
  name: string;
}

export const TabBarIcon = (props: Props) => {
  const { focused, name } = props;

  const color = focused ? colors.tabIconSelected : colors.tabIconDefault;

  return (
    <Icon
      name={name}
      size={24}
      style={{ marginBottom: -3 }}
      color={color}
    />
  );
};