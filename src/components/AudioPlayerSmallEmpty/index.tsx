import React from 'react';
import { View, Text } from 'react-native';

import * as Icon from '../../components/Icon';

import styles from './styles';

export const AudioPlayerSmallEmpty: React.FC = React.memo(() => (
  <View style={styles.wrapper}>
    <View style={styles.container}>
      <View style={styles.placeHolder}>
        <Text style={styles.emptyText}>Select an article to listen</Text>
        <View style={styles.icon}>
          <Icon.FontAwesome name="arrow-up" color="white" size={14} />
        </View>
      </View>
    </View>
  </View>
));
