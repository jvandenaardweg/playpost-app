import React from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import styles from './styles';

interface Props {
  isLoading?: boolean;
  isPlaying?: boolean;
  onPress(): void;
}

export const VoicePreviewButton: React.FC<Props> = React.memo(({
  isLoading,
  isPlaying,
  onPress
}) => (
  <TouchableOpacity style={styles.container} activeOpacity={1} onPress={onPress} hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}>
    {!isPlaying && !isLoading && <Icon name="play" size={10} style={styles.icon} />}
    {isPlaying && !isLoading && <Icon name="pause" size={10} style={styles.icon} />}
    {isLoading && !isPlaying && <ActivityIndicator />}
  </TouchableOpacity>
));
