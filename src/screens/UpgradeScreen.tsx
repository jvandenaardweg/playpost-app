import React from 'react';
import { NavigationScreenProp, NavigationRoute, NavigationScreenOptions } from 'react-navigation';
import { ScrollView } from 'react-native';
import { ButtonClose } from '../components/Header/ButtonClose';
import { UpgradeFeatures } from '../components/UpgradeFeatures';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class UpgradeScreen extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationScreenOptions => {
    return {
      title: 'Upgrade',
      headerLeft: null,
      headerRight: <ButtonClose onPress={navigation.getParam('handleOnClose')} />,
      headerTintColor: '#000'

    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleOnClose: this.handleOnClose });
  }

  handleOnClose = () => {
    this.props.navigation.navigate('App');
  }

  render() {
    return (
      <ScrollView>
        <UpgradeFeatures />
      </ScrollView>
    );
  }
}
