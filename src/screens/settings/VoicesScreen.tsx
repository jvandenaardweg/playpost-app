import React from 'react';
import { NavigationScreenProp, NavigationRoute, NavigationStackScreenOptions } from 'react-navigation';
import { ScrollView } from 'react-native';
import { ButtonUpgrade } from '../../components/ButtonUpgrade';
import { VoiceSelectContainer } from '../../containers/VoiceSelectContainer';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class SettingsVoicesScreen extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: 'Voices',
      headerRight: <ButtonUpgrade onPress={navigation.getParam('handleOnPressUpgrade')} />,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleOnPressUpgrade: this.handleOnPressUpgrade });
  }

  handleOnPressUpgrade = () => {
    this.props.navigation.navigate('Upgrade');
  }

  render() {
    return (
      <ScrollView>
        <VoiceSelectContainer />
      </ScrollView>
    );
  }
}
