import React from 'react';
import { Text, View } from 'react-native';

// import * as Icon from '../../components/Icon';

import styles from './styles';

export const AudioPlayerSmallEmpty: React.FC = React.memo(() => (
  <View style={styles.wrapper} testID="AudioPlayerSmallEmpty">
    <View style={styles.container}>
      <View style={styles.placeHolder}>
        <Text style={styles.emptyText} testID="AudioPlayerSmallEmpty-Text-empty">Select an article to listen</Text>
        {/* <View style={styles.icon}>
          <Icon.FontAwesome name="arrow-up" color="white" size={14} />
        </View> */}
      </View>
    </View>
  </View>
));
