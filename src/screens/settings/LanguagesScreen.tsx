import React from 'react';
import { NavigationScreenProp, NavigationRoute, NavigationStackScreenOptions } from 'react-navigation';
import { ScrollView } from 'react-native';

import { ButtonUpgrade } from '../../components/Header/ButtonUpgrade';
import { LanguagesSelect } from '../../components/LanguagesSelect';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class SettingsLanguagesScreen extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: 'Languages',
      headerRight: <ButtonUpgrade onPress={navigation.getParam('handleOnPressUpgrade')} />,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleOnPressUpgrade: this.handleOnPressUpgrade });
  }

  handleOnPressUpgrade = () => this.props.navigation.navigate('Upgrade');

  handleOnSelectLanguage = (languageName: string) => this.props.navigation.navigate('SettingsVoices', { languageName });

  render() {
    return (
      <ScrollView>
        <LanguagesSelect onSelectLanguage={this.handleOnSelectLanguage} />
      </ScrollView>
    );
  }
}
