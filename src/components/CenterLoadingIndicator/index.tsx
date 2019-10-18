import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';

import colors from '../../constants/colors';

import { UserThemeContext } from '../../contexts/UserThemeProvider';
import { UserTheme } from '../../reducers/user';
import styles from './styles';

interface Props {
  backgroundColor?: string;
}

export const CenterLoadingIndicator: React.FC<Props>  = React.memo((props) => {
  const { theme } = useContext(UserThemeContext);

  const activityIndicatorColor = theme === UserTheme.dark ? colors.white : colors.black;
  const backgroundColor = (props.backgroundColor) ? props.backgroundColor : undefined;

  return (
    <View style={[styles(theme).container, { backgroundColor }]}>
      <ActivityIndicator size="small" color={activityIndicatorColor} />
    </View>
  )
})
