import React, { useContext } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';

import * as Icon from '../Icon';

import { UserThemeContext } from '../../contexts/UserThemeProvider';
import styles from './styles';

interface Props {
  isLoading?: boolean;
  isPlaying?: boolean;
  isActive?: boolean;
  isAvailable?: boolean;
  onPress(): void;
}

export const ButtonVoicePreview: React.FC<Props> = React.memo((props) => {
  const { theme } = useContext(UserThemeContext)

  return (
    <TouchableOpacity
      testID="ButtonViewPreview-TouchableOpacity"
      style={[styles(theme).container, (props.isPlaying || props.isActive) ? styles(theme).containerActive : null, (props.isAvailable && !props.isActive) ? styles(theme).isAvailable : null]}
      disabled={props.isLoading}
      activeOpacity={1}
      onPress={props.onPress}
      hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}>
      {!props.isPlaying && !props.isLoading && <Icon.FontAwesome5 name="play" size={9} style={styles(theme).icon} testID="ButtonViewPreview-Icon-play" />}
      {props.isPlaying && !props.isLoading && <Icon.FontAwesome5 name="pause" size={9} style={styles(theme).icon} testID="ButtonViewPreview-Icon-pause" />}
      {props.isLoading && !props.isPlaying && <ActivityIndicator color="white" testID="ButtonViewPreview-ActivityIndicator" />}
    </TouchableOpacity>
  )
})
