import React from 'react';
import { ActivityIndicator, Linking, Text, View } from 'react-native';
import urlParse from 'url-parse';

import colors from '../../constants/colors';

import styles from './styles';

import * as Icon from '../../components/Icon';

interface Props {
  onPressUpdate?:() => void;
  isLoading: boolean;
  url: string;
}

export const ArticleEmptyNew: React.FC<Props> = React.memo((props: Props) => (
  <View style={styles.articleEmptyContainer}>
    <View style={styles.articleEmptyIcon}>
      <Icon.FontAwesome5 name="exclamation-circle" size={34} color={colors.black} />
    </View>
    <View style={styles.articleEmptyContent}>
      <Text style={styles.articleEmptyTitle}>Not processing article, yet!</Text>
      <Text style={styles.articleEmptyText}>Hold on, it seems busy. We will start processing this article shortly.</Text>
      <View style={styles.articleEmptyFooter}>
        {props.isLoading && <ActivityIndicator size="small" color={colors.black} />}
        {!props.isLoading && <Text style={[styles.articleEmptyText, styles.link]} onPress={props.onPressUpdate}>Check for update</Text>}
      </View>
    </View>
  </View>
));

export const ArticleEmptyProcessing: React.FC<Props> = React.memo((props: Props) => (
  <View style={styles.articleEmptyContainer}>
    <View style={styles.articleEmptyIcon}>
      <Icon.FontAwesome5 name="exclamation-circle" size={34} color={colors.black} />
    </View>
    <View style={styles.articleEmptyContent}>
      <Text style={styles.articleEmptyTitle}>Processing article...</Text>
      <Text style={styles.articleEmptyText}>The article from "{urlParse(props.url).hostname}" is still being processed.</Text>
      <View style={styles.articleEmptyFooter}>
        {props.isLoading && <ActivityIndicator size="small" color={colors.black} />}
        {!props.isLoading && <Text style={[styles.articleEmptyText, styles.link]} onPress={props.onPressUpdate}>Check for update</Text>}
      </View>
    </View>
  </View>
));

export const ArticleEmptyFailed: React.FC<Props> = React.memo((props: Props) => (
  <View style={[styles.articleEmptyContainer, styles.isFailed]}>
    <View style={styles.articleEmptyIcon}>
      <Icon.FontAwesome5 name="exclamation-circle" size={34} color={colors.white} />
    </View>
    <View style={styles.articleEmptyContent}>
      <Text style={[styles.articleEmptyTitle, styles.textWhite]}>Failed to process an article</Text>
      <Text style={[styles.articleEmptyText, styles.textWhite]}>Please remove the article from your playlist and try again.</Text>
      <Text style={[styles.articleEmptyText, styles.textWhite, styles.link]}
        numberOfLines={3}
        ellipsizeMode="tail"
        onPress={() => Linking.openURL(props.url)}
      >
        {props.url}
      </Text>
    </View>
  </View>
));
