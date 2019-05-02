import React from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';

import * as Icon from '../../components/Icon';

import styles from './styles';

interface Props {
  isLoading?: boolean;
  isPlaying?: boolean;
  isActive?: boolean;
  onPress(): void;
}

export const VoicePreviewButton: React.FC<Props> = React.memo(({
  isLoading,
  isPlaying,
  isActive,
  onPress
}) => (
  <TouchableOpacity
    style={[styles.container, (isPlaying || isActive) ? styles.containerActive : null]}
    activeOpacity={1}
    onPress={onPress}
    hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}>
    {!isPlaying && !isLoading && <Icon.FontAwesome5 name="play" size={9} style={styles.icon} />}
    {isPlaying && !isLoading && <Icon.FontAwesome5 name="pause" size={9} style={styles.icon} />}
    {isLoading && !isPlaying && <ActivityIndicator />}
  </TouchableOpacity>
));
