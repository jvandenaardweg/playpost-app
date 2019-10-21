import React, { ReactNode, useContext } from 'react';
import { View } from 'react-native';

import { UserThemeContext } from '../../contexts/UserThemeProvider';
import styles from './styles';

interface Props {
  children: ReactNode;
}

export const AppBackground: React.FC<Props> = React.memo((props) => {
  const { theme } = useContext(UserThemeContext)

  return (
    <View style={styles(theme).container}>
      {props.children}
    </View>
  )
});
