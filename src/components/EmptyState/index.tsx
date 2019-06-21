import React from 'react';
import { View, Text } from 'react-native';

import styles from './styles';
import { Button } from 'react-native-elements';
import { VideoPlayer } from '../VideoPlayer';

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
      {title && <Text style={styles.title} testID="empty-state-title">{title}</Text>}
      {description && <Text style={styles.description} testID="empty-state-description">{description.join('\n\n')}</Text>}
      {localVideo && <VideoPlayer localVideo={localVideo} />}
      {actionButtonLabel && <Button buttonStyle={styles.button} title={actionButtonLabel} onPress={actionButtonOnPress} testID="empty-state-button" />}
    </View>
  </View>
));
