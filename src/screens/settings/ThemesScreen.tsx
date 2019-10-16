import React from 'react';
import { NavigationRoute, NavigationScreenProp } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';

import { AppBackground } from '../../components/AppBackground';
import { InteractionManaged } from '../../components/InteractionManaged';
import { ThemeSelectContainer } from '../../containers/ThemeSelectContainer';

export class SettingsThemesScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackOptions => {
    return {
      title: 'Theme'
    };
  }

  render() {
    return (
      <InteractionManaged>
        <AppBackground>
          <ThemeSelectContainer />
        </AppBackground>
      </InteractionManaged>
    );
  }
}
