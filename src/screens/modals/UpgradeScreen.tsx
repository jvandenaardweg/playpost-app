import React from 'react';
import { NavigationRoute, NavigationScreenOptions, NavigationScreenProp } from 'react-navigation';
import { AppBackground } from '../../components/AppBackground';
import { UpgradeContainer } from '../../containers/UpgradeContainer';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class UpgradeScreen extends React.PureComponent<Props> {
  public static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationScreenOptions => {
    return {
      title: 'Upgrade subscription',
      headerLeft: null
    };
  }

  public render() {
    return (
      <AppBackground>
        <UpgradeContainer />
      </AppBackground>
    );
  }
}
