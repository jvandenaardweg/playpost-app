import React from 'react';
import { NavigationScreenProp, NavigationRoute, NavigationScreenOptions } from 'react-navigation';
import { ScrollView } from 'react-native';
import { ButtonClose } from '../components/Header/ButtonClose';
import { Upgrade } from '../components/Upgrade';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class UpgradeScreen extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationScreenOptions => {
    return {
      title: 'Upgrade to Premium',
      headerLeft: null,
      headerRight: <ButtonClose onPress={navigation.getParam('handleOnClose')} />
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
        <Upgrade onClose={this.handleOnClose} />
      </ScrollView>
    );
  }
}
