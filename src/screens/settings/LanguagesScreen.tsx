import React from 'react';
import { NavigationRoute, NavigationScreenProp, NavigationStackScreenOptions } from 'react-navigation';
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
      <InteractionManaged>
        <LanguagesSelectContainer />
      </InteractionManaged>
    );
  }
}
