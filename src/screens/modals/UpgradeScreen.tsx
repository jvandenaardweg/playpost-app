import React from 'react';
import { NavigationScreenProp, NavigationRoute, NavigationScreenOptions } from 'react-navigation';
import { ButtonClose } from '../../components/ButtonClose';
import { UpgradeContainer } from '../../containers/UpgradeContainer';
import { AppBackground } from '../../components/AppBackground';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class UpgradeScreen extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationScreenOptions => {
    return {
      title: 'Upgrade subscription',
      headerLeft: null,
      headerRight: <ButtonClose onPress={navigation.getParam('handleOnClose')} />
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleOnClose: this.handleOnClose });
  }

  handleOnClose = () => {
    this.props.navigation.goBack(null);
  }

  render() {
    return (
      <AppBackground>
        <UpgradeContainer />
      </AppBackground>
    );
  }
}
