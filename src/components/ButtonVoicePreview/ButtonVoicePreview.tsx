import React from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';

import * as Icon from '../Icon';

import styles from './styles';

interface Props {
  isLoading?: boolean;
  isPlaying?: boolean;
  isActive?: boolean;
  isAvailable?: boolean;
  onPress(): void;
}

export const ButtonVoicePreview: React.FC<Props> = React.memo(({
  isLoading,
  isPlaying,
  isActive,
  isAvailable,
  onPress
}) => (
  <TouchableOpacity
    style={[styles.container, (isPlaying || isActive) ? styles.containerActive : null, (isAvailable && !isActive) ? styles.isAvailable : null]}
    activeOpacity={1}
    onPress={onPress}
    hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}>
    {!isPlaying && !isLoading && <Icon.FontAwesome5 name="play" size={9} style={styles.icon} />}
    {isPlaying && !isLoading && <Icon.FontAwesome5 name="pause" size={9} style={styles.icon} />}
    {isLoading && !isPlaying && <ActivityIndicator color="white" />}
  </TouchableOpacity>
));
