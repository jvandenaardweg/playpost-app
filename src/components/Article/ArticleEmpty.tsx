import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Button } from 'react-native-elements';

import * as Icon from '../../components/Icon';

import colors from '../../constants/colors';

import styles from './styles';

interface Props {
  onPressUpdate?:() => void;
  url: string;
}

export const ArticleEmptyProcessing: React.FC<Props> = props => (
  <View style={styles.articleEmpty}>
    <ActivityIndicator style={styles.articleEmptyActivityIndicator} />
    <Text style={styles.articleEmptyText}>Processing article...</Text>
    <Button type="clear" title="Update" onPress={props.onPressUpdate} icon={<Icon.Feather name="refresh-ccw" size={18} color={colors.tintColor} style={{ marginLeft: 10 }} />} iconRight />
  </View>
);

export const ArticleEmptyFailed: React.FC<Props> = props => (
  <View style={styles.articleEmpty}>
    <Text style={styles.articleEmptyText}>Article processing failed. Remove this article and try again: {props.url}</Text>
  </View>
);
