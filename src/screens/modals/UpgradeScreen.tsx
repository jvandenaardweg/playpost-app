import React from 'react';
import { NavigationRoute, NavigationScreenProp } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';

import { AppBackground } from '../../components/AppBackground';
import { InteractionManaged } from '../../components/InteractionManaged';
import { UpgradeContainer } from '../../containers/UpgradeContainer';

interface Props {
  navigation: NavigationScreenProp<NavigationRoute>;
}

export class UpgradeScreen extends React.PureComponent<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackOptions => {
    return {
      title: 'Upgrade subscription',
      headerLeft: null
    };
  }

  render() {
    const centeredSubscriptionProductId = this.props.navigation.getParam('centeredSubscriptionProductId', '')

    return (
      <AppBackground>
        <InteractionManaged>
          <UpgradeContainer centeredSubscriptionProductId={centeredSubscriptionProductId} />
        </InteractionManaged>
      </AppBackground>
    );
  }
}
