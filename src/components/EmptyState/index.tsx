import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';

import { Text } from '../Text';
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

export const EmptyState: React.FC<Props> = React.memo(({ title, description, actionButtonLabel, localVideo, actionButtonOnPress }) => (
  <View style={styles.container}>
    <View style={styles.content}>
      {title && <Text style={styles.title} testID="empty-state-title" preset="title3Emphasized">{title}</Text>}
      {description && <Text style={styles.description} testID="empty-state-description" preset="subhead">{description.join('\n\n')}</Text>}
      {localVideo && <VideoPlayer localVideo={localVideo} />}
      {actionButtonLabel && <Button buttonStyle={styles.button} title={actionButtonLabel} onPress={actionButtonOnPress} testID="empty-state-button" />}
    </View>
  </View>
));
