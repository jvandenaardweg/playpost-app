import React from 'react';
import { NavigationRoute, NavigationScreenProp, NavigationStackScreenOptions } from 'react-navigation';
import { AppBackground } from '../../components/AppBackground';
import { InteractionManaged } from '../../components/InteractionManaged';
import { LanguagesSelectContainer } from '../../containers/LanguageSelectContainer';

export class SettingsLanguagesScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: 'Languages'
    };
  }

  render() {
    return (
      <AppBackground>
        <InteractionManaged>
          <LanguagesSelectContainer />
        </InteractionManaged>
      </AppBackground>
    );
  }
}
