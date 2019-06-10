import React from 'react';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import { ScrollView } from 'react-native';

import { LanguagesSelect } from '../../components/LanguagesSelect';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class SettingsLanguagesScreen extends React.PureComponent<Props> {
  handleOnSelectLanguage = (languageName: string) => this.props.navigation.navigate('SettingsVoices', { languageName });

  render() {
    return (
      <ScrollView>
        <LanguagesSelect onSelectLanguage={this.handleOnSelectLanguage} />
      </ScrollView>
    );
  }
}
