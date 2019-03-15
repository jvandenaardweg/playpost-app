import React from 'react';
import { View } from 'react-native';
import { ProgressComponent } from 'react-native-track-player';

import styles from './styles';

export class ProgressBar extends ProgressComponent {
  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.progress, { width: `${this.getProgress()}%` }]} />
      </View>
    );
  }
}
