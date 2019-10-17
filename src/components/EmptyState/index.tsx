import React, { useContext } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';

import { UserThemeContext } from '../../contexts/UserThemeProvider';
import Text from '../Text';
import { VideoPlayer } from '../VideoPlayer';
import styles from './styles';

/* tslint:disable no-any */
interface Props {
  title?: string;
  description?: string[];
  localVideo?: any;
  actionButtonLabel?: string;
  actionButtonOnPress?(): void;
}

export const EmptyState: React.FC<Props> = React.memo((props) => {
  const { theme } = useContext(UserThemeContext)

  return (
    <View style={styles(theme).container}>
      <View style={styles(theme).content}>
        {props.title && <Text style={styles(theme).title} testID="empty-state-title" preset="title3Emphasized">{props.title}</Text>}
        {props.description && <Text style={styles(theme).description} testID="empty-state-description" preset="lead">{props.description.join('\n\n')}</Text>}
        {props.localVideo && <VideoPlayer localVideo={props.localVideo} />}
        {props.actionButtonLabel && <Button buttonStyle={styles(theme).button} title={props.actionButtonLabel} onPress={props.actionButtonOnPress} testID="empty-state-button" />}
      </View>
    </View>
  )
})
