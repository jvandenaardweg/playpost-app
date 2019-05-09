import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import urlParse from 'url-parse';

import fonts from '../../constants/fonts';
import colors from '../../constants/colors';
import spacing from '../../constants/spacing';

import * as Icon from '../../components/Icon';

interface Props {
  onPressUpdate?:() => void;
  isLoading: boolean;
  url: string;
}

export const ArticleEmptyProcessing: React.FC<Props> = React.memo((props: Props) => (
  <View style={styles.articleEmptyContainer}>
    <View style={styles.articleEmptyIcon}>
      <Icon.FontAwesome5 name="exclamation-circle" size={34} color={colors.black} />
    </View>
    <View style={styles.articleEmptyContent}>
      <Text style={styles.articleEmptyTitle}>Processing article...</Text>
      <Text style={styles.articleEmptyText}>The article from "{urlParse(props.url).hostname}" is still being processed.</Text>
      <Text style={[styles.articleEmptyText, styles.link]} onPress={props.onPressUpdate}>
        {props.isLoading && 'Checking for update...'}
        {!props.isLoading && 'Check for update'}
      </Text>
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
      <Text style={[styles.articleEmptyText, styles.textWhite, styles.link]} onPress={() => Linking.openURL(props.url)}>{props.url}</Text>
    </View>
  </View>
));

const styles = StyleSheet.create({
  articleEmptyContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.appBackground,
    padding: spacing.medium,
    width: '100%'
  },
  isFailed: {
    backgroundColor: colors.red,
  },
  textWhite: {
    color: colors.white
  },
  textFaded: {
    opacity: 0.9,
  },
  articleEmptyIcon: {
    justifyContent: 'center',
    width: 50
  },
  articleEmptyContent: {
    flexShrink: 1,
  },
  articleEmptyTitle: {
    fontSize: fonts.fontSize.body,
    fontWeight: fonts.fontWeight.semibold,
    color: colors.black,
    lineHeight: 21,
    marginBottom: spacing.tiny
  },
  articleEmptyText: {
    color: colors.black,
    opacity: 0.9,
    marginBottom: spacing.tiny
  },
  link: {
    textDecorationLine: 'underline'
  }
});
