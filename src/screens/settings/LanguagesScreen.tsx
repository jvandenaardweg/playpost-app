import React from 'react';
import { NavigationScreenProp, NavigationRoute, NavigationStackScreenOptions } from 'react-navigation';
import { LanguagesSelectContainer } from '../../containers/LanguageSelectContainer';
import { AppBackground } from '../../components/AppBackground';
import { ButtonUpgradeContainer } from '../../containers/ButtonUpgradeContainer';

export class SettingsLanguagesScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: 'Languages',
      headerRight: <ButtonUpgradeContainer />
    };
  }

  render() {
    return (
      <AppBackground>
        <LanguagesSelectContainer />
      </AppBackground>
    );
  }
}
