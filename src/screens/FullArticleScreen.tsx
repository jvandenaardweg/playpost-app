import React from 'react';
import { NavigationRoute, NavigationScreenProp } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';

import { ArticleReader } from '../components/ArticleReader';
import { InteractionManaged } from '../components/InteractionManaged';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class FullArticleScreen extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackOptions => {
    return {
      title: ''
    };
  }

  get article () {
    return this.props.navigation.getParam('article', null);
  }

  render() {
    return (
      <InteractionManaged>
        <ArticleReader article={this.article} />
      </InteractionManaged>
    );
  }
}
