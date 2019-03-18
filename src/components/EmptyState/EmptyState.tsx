import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import styles from './styles';
import { Button } from 'react-native-elements';
import colors from '../../constants/colors';

interface Props {
  title: string;
  subtitle?: string;
  description: string;
  actionButtonLabel?: string;
  icon?: string;
  actionButtonOnPress?(): void;
}

export const EmptyState: React.FC<Props> = ({ title, subtitle, description, actionButtonLabel, icon, actionButtonOnPress }) => (
  <View style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.description}>{subtitle}</Text>}
      {icon && <TouchableOpacity style={styles.icon} onPress={actionButtonOnPress} activeOpacity={1}><Icon name={icon} size={20} color={colors.tintColor} /></TouchableOpacity>}
      <Text style={styles.description}>{description}</Text>

      {actionButtonLabel && <Button buttonStyle={styles.button} title={actionButtonLabel} onPress={actionButtonOnPress} />}
    </View>
  </View>
);
