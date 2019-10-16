import React, { useContext } from 'react';
import { View } from 'react-native';

import { UserThemeContext } from '../../contexts/UserThemeProvider';
import styles from './styles';

export const ListSeperator: React.FC = React.memo(() => {
  const { theme } = useContext(UserThemeContext)

  return (
    <View style={styles(theme).seperator}>
      <View style={styles(theme).seperatorLine}></View>
    </View>
  )
});
