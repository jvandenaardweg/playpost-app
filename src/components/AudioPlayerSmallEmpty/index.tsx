import React from 'react';
import { View } from 'react-native';

import { Text } from '../Text';

import styles from './styles';

export const AudioPlayerSmallEmpty: React.FC = React.memo(() => (
  <View style={styles.wrapper} testID="AudioPlayerSmallEmpty">
    <View style={styles.container}>
      <View style={styles.placeHolder}>
        <Text style={styles.emptyText} testID="AudioPlayerSmallEmpty-Text-empty" preset="subheadEmphasized">Select an article to listen</Text>
      </View>
    </View>
  </View>
));
