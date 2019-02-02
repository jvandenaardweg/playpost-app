import React from 'react';
// import { Icon } from 'expo';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Colors from '../constants/Colors';

export default class TabBarIcon extends React.PureComponent {
  render() {
    const { focused, name } = this.props

    const color = focused ? Colors.tabIconSelected : Colors.tabIconDefault
    // const size = focused ? 24 : 22

    return (
      <Icon
        name={name}
        size={24}
        style={{ marginBottom: -3 }}
        color={color}
      />
    );
  }
}
