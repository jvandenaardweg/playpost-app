import React from 'react';
import { NavigationScreenProp, NavigationRoute, NavigationScreenOptions } from 'react-navigation';
import { ScrollView } from 'react-native';
import { ButtonClose } from '../components/ButtonClose';
import { URL_FEEDBACK } from '../constants/urls';
import { UpgradeContainer } from '../containers/UpgradeContainer';

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

  handleOnPressSupport = () => {
    this.props.navigation.navigate('Browser', { url: URL_FEEDBACK, title: 'Support' });
  }

  render() {
    return (
      <ScrollView>
        <UpgradeContainer onClose={this.handleOnClose} onPressSupport={this.handleOnPressSupport} />
      </ScrollView>
    );
  }
}
