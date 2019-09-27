import React from 'react';
import { NavigationRoute, NavigationScreenProp } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';

import { AppBackground } from '../../components/AppBackground';
import { InteractionManaged } from '../../components/InteractionManaged';
import { LanguagesSelectContainer } from '../../containers/LanguageSelectContainer';

export class SettingsLanguagesScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackOptions => {
    return {
      title: 'Languages'
    };
  }

  render() {
    return (
      <InteractionManaged>
        <AppBackground>
          <LanguagesSelectContainer />
        </AppBackground>
      </InteractionManaged>
    );
  }
}
