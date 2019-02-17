import React from 'react';
import Icon from 'react-native-vector-icons/Feather';

import Colors from '../constants/Colors';

export const TabBarIcon = (props) => {
  const { focused, name } = props;

  const color = focused ? Colors.tabIconSelected : Colors.tabIconDefault;

  return (
    <Icon
      name={name}
      size={24}
      style={{ marginBottom: -3 }}
      color={color}
    />
  );
};
