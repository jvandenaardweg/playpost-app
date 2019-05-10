import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { NavigationScreenProp, NavigationRoute, NavigationStackScreenOptions } from 'react-navigation';

import colors from '../constants/colors';
import spacing from '../constants/spacing';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class FullArticleScreen extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: navigation.getParam('article', null).title
    };
  }

  get article () {
    return this.props.navigation.getParam('article', null);
  }

  render() {
    return (
      <ScrollView>
        <View style={{ flex: 1, backgroundColor: colors.appBackground, padding: spacing.default }}>
          <Text style={{ fontSize: 20, fontWeight: '600', lineHeight: 24, marginBottom: 12 }}>{this.article.title}</Text>
          <Text>{this.article.authorName}</Text>
          {this.article.text && this.article.text.split('\n\n').map((text: string, index: number) => <Text key={index} style={{ fontFamily: 'Merriweather', lineHeight: 24, color: colors.paragraphDefault }}>{text}{'\n'}</Text>)}
        </View>
      </ScrollView>
    );
  }
}
