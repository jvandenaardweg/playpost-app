import React from 'react';
import { ScrollView } from 'react-native';

import { LanguagesSelectContainer } from '../../containers/LanguageSelectContainer';

export class SettingsLanguagesScreen extends React.PureComponent {
  render() {
    return (
      <ScrollView>
        <LanguagesSelectContainer />
      </ScrollView>
    );
  }
}
