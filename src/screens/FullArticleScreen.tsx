import React from 'react';
import { NavigationScreenProp, NavigationRoute, NavigationStackScreenOptions } from 'react-navigation';

import { ArticleReader } from '../components/ArticleReader';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class FullArticleScreen extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: ''
    };
  }

  get article () {
    return this.props.navigation.getParam('article', null);
  }

  render() {
    return (
      <ArticleReader article={this.article} />
    );
  }
}
