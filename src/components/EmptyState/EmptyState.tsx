import React from 'react';
import { View, Text } from 'react-native';

import styles from './styles';
import { Button } from 'react-native-elements';

interface Props {
  title: string;
  description: string;
  actionButtonLabel?: string;
  actionButtonOnPress?(): void;
}

export const EmptyState: React.FC<Props> = ({ title, description, actionButtonLabel, actionButtonOnPress }) => (
  <View style={styles.container}>
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionButtonLabel && <Button style={styles.button} title={actionButtonLabel} onPress={actionButtonOnPress} />}
    </View>
  </View>
);
