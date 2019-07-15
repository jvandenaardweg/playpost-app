import React from 'react';
import { NavigationRoute, NavigationScreenProp, NavigationStackScreenOptions } from 'react-navigation';
import { AppBackground } from '../../components/AppBackground';
import { LanguagesSelectContainer } from '../../containers/LanguageSelectContainer';

export class SettingsLanguagesScreen extends React.PureComponent {
  public static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: 'Languages'
    };
  }

  public render() {
    return (
      <AppBackground>
        <LanguagesSelectContainer />
      </AppBackground>
    );
  }
}
