import React, { useContext } from 'react';
import { View } from 'react-native';

import Text from '../Text';

import { UserThemeContext } from '../../contexts/UserThemeProvider';
import styles from './styles';

export const AudioPlayerSmallEmpty: React.FC = React.memo(() => {
  const { theme } = useContext(UserThemeContext);

  return (
    <View style={styles(theme).wrapper} testID="AudioPlayerSmallEmpty">
      <View style={styles(theme).container}>
        <View style={styles(theme).placeHolder}>
          <Text style={styles(theme).emptyText} testID="AudioPlayerSmallEmpty-Text-empty" preset="subheadEmphasized">Select an article to listen</Text>
        </View>
      </View>
    </View>
  )
})
