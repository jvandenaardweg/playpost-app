import React from 'react';
import { NavigationScreenProp, NavigationRoute, NavigationStackScreenOptions } from 'react-navigation';

import { ArticleView } from '../components/ArticleView/ArticleView';

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
      <ArticleView article={this.article} />
    );
  }
}
