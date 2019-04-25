import React from 'react';
import { NavigationScreenProp, NavigationRoute, NavigationScreenOptions } from 'react-navigation';
import { ScrollView } from 'react-native';
import { VoicesSelect } from '../components/VoicesSelect';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class SettingsVoicesScreen extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationScreenOptions => {
    return {
      title: 'Voices',
      // headerLeft: null,
    };
  }

  render() {
    return (
      <ScrollView>
        <VoicesSelect />
      </ScrollView>
    );
  }
}
