import React from 'react';
import { ActivityIndicator, Linking, View } from 'react-native';
import urlParse from 'url-parse';

import colors from '../../constants/colors';
import { Text } from '../Text'

import styles from './styles';

import * as Icon from '../Icon';

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
      <Text style={styles.articleEmptyTitle} preset="subheadEmphasized">Not processing article, yet!</Text>
      <Text style={styles.articleEmptyText} preset="subhead">Hold on, it seems busy. We will start processing this article shortly.</Text>
      <View style={styles.articleEmptyFooter}>
        {props.isLoading && <ActivityIndicator size="small" color={colors.black} />}
        {!props.isLoading && <Text style={[styles.articleEmptyText, styles.link]} onPress={props.onPressUpdate} preset="subhead">Check for update</Text>}
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
      <Text style={styles.articleEmptyTitle} preset="subheadEmphasized">Processing article...</Text>
      <Text style={styles.articleEmptyText} preset="subhead">The article from "{urlParse(props.url).hostname}" is still being processed.</Text>
      <View style={styles.articleEmptyFooter}>
        {props.isLoading && <ActivityIndicator size="small" color={colors.black} />}
        {!props.isLoading && <Text style={[styles.articleEmptyText, styles.link]} onPress={props.onPressUpdate} preset="subhead">Check for update</Text>}
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
      <Text style={[styles.articleEmptyTitle, styles.textWhite]} preset="subheadEmphasized">Failed to process an article</Text>
      <Text style={[styles.articleEmptyText, styles.textWhite]} preset="subhead">Please remove the article from your playlist and try again.</Text>
      <Text style={[styles.articleEmptyText, styles.textWhite, styles.link]}
        numberOfLines={1}
        ellipsizeMode="tail"
        onPress={() => Linking.openURL(props.url)}
        preset="subhead"
        // We want to use Linking here, instead of in app browser.
        // so the app goes into the background and when it comes back again, it will auto-fetch the article again
      >
        {props.url}
      </Text>
    </View>
  </View>
));
