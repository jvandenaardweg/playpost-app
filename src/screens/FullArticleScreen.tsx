import React from 'react';
import { NavigationRoute, NavigationScreenProp, NavigationStackScreenOptions } from 'react-navigation';

import { ArticleReader } from '../components/ArticleReader';
import { InteractionManaged } from '../components/InteractionManaged';

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
      <InteractionManaged>
        <ArticleReader article={this.article} />
      </InteractionManaged>
    );
  }
}
