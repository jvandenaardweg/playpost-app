import React from 'react';
import { NavigationRoute, NavigationScreenProp, NavigationStackScreenOptions } from 'react-navigation';

import { ArticleReader } from '../components/ArticleReader';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class FullArticleScreen extends React.PureComponent<Props> {
  public static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: ''
    };
  }

  get article () {
    return this.props.navigation.getParam('article', null);
  }

  public render() {
    return (
      <ArticleReader article={this.article} />
    );
  }
}
