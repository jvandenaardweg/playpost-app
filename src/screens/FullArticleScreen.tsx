import React from 'react';
import { NavigationRoute, NavigationScreenComponent, NavigationScreenProp } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';

import { AppBackground } from '../components/AppBackground';
import { ArticleReader } from '../components/ArticleReader';
import { InteractionManaged } from '../components/InteractionManaged';

export const FullArticleScreen: NavigationScreenComponent<{}, NavigationScreenProp<NavigationRoute>> = React.memo((props) => {
  return (
    <AppBackground>
      <InteractionManaged>
        <ArticleReader article={props.navigation.getParam('article', null)} />
      </InteractionManaged>
    </AppBackground>
  );
})

FullArticleScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackOptions => {
  return {
    title: ''
  };
}
