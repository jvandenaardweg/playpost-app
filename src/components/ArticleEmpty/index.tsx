import React, { useContext } from 'react';
import { ActivityIndicator, Linking, View } from 'react-native';
import urlParse from 'url-parse';

import colors from '../../constants/colors';
import Text from '../Text'

import styles from './styles';

import * as Icon from '../Icon';
import { UserThemeContext } from '../../contexts/UserThemeProvider';
import { UserTheme } from '../../reducers/user';

interface Props {
  onPressUpdate?:() => void;
  isLoading: boolean;
  url: string;
}

export const ArticleEmptyNew: React.FC<Props> = React.memo((props: Props) => {
  const { theme } = useContext(UserThemeContext);

  const activityIndicatorColor = (theme === UserTheme.dark) ? colors.white : colors.black;
  const iconColor = (theme === UserTheme.dark) ? colors.white : colors.black;

  return (
    <View style={styles(theme).articleEmptyContainer}>
      <View style={styles(theme).articleEmptyIcon}>
      <Icon.Feather name="alert-circle" size={32} color={iconColor} />
      </View>
      <View style={styles(theme).articleEmptyContent}>
        <Text style={styles(theme).articleEmptyTitle} preset="subheadEmphasized">Not processing article, yet!</Text>
        <Text style={styles(theme).articleEmptyText} preset="subhead">Hold on, it seems busy. We will start processing this article shortly.</Text>
        <View style={styles(theme).articleEmptyFooter}>
          {props.isLoading && <ActivityIndicator size="small" color={activityIndicatorColor} />}
          {!props.isLoading && <Text style={[styles(theme).articleEmptyText, styles(theme).link]} onPress={props.onPressUpdate} preset="subhead">Check for update</Text>}
        </View>
      </View>
    </View>
  )
});

export const ArticleEmptyProcessing: React.FC<Props> = React.memo((props: Props) => {
  const { theme } = useContext(UserThemeContext);

  const activityIndicatorColor = (theme === UserTheme.dark) ? colors.white : colors.black;
  const iconColor = (theme === UserTheme.dark) ? colors.white : colors.black;

  return (
    <View style={styles(theme).articleEmptyContainer}>
      <View style={styles(theme).articleEmptyIcon}>
      <Icon.Feather name="alert-circle" size={32} color={iconColor} />
      </View>
      <View style={styles(theme).articleEmptyContent}>
        <Text style={styles(theme).articleEmptyTitle} preset="subheadEmphasized">Processing article...</Text>
        <Text style={styles(theme).articleEmptyText} preset="subhead">The article from "{urlParse(props.url).hostname}" is still being processed.</Text>
        <View style={styles(theme).articleEmptyFooter}>
          {props.isLoading && <ActivityIndicator size="small" color={activityIndicatorColor} />}
          {!props.isLoading && <Text style={[styles(theme).articleEmptyText, styles(theme).link]} onPress={props.onPressUpdate} preset="subhead">Check for update</Text>}
        </View>
      </View>
    </View>
  )
});

export const ArticleEmptyFailed: React.FC<Props> = React.memo((props: Props) => {
  const { theme } = useContext(UserThemeContext);

  const iconColor = (theme === UserTheme.dark) ? colors.white : colors.black;

  return (
    <View style={styles(theme).articleEmptyContainer}>
      <View style={styles(theme).articleEmptyIcon}>
        <Icon.Feather name="alert-circle" size={32} color={iconColor} />
      </View>
      <View style={styles(theme).articleEmptyContent}>
        <Text style={styles(theme).articleEmptyTitle} preset="subheadEmphasized">Could not process this article correctly</Text>
        <Text style={styles(theme).articleEmptyText} preset="subhead">Please remove this article from your playlist and try again.</Text>
        <Text style={[styles(theme).articleEmptyText, styles(theme).link]}
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
  )
});
