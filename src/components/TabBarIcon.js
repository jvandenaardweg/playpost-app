import React from 'react';
import Icon from 'react-native-vector-icons/Feather';

import Colors from '../constants/Colors';

export const TabBarIcon = (props) => {
  const color = props.focused ? Colors.tabIconSelected : Colors.tabIconDefault;

  return (
    <Icon
      name={props.name}
      size={24}
      style={{ marginBottom: -3 }}
      color={color}
    />
  );
};
