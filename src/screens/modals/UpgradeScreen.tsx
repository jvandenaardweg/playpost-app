import React from 'react';
import { NavigationRoute, NavigationScreenComponent, NavigationScreenProp } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';

import { AppBackground } from '../../components/AppBackground';
import { InteractionManaged } from '../../components/InteractionManaged';
import { UpgradeContainer } from '../../containers/UpgradeContainer';

export const UpgradeScreen: NavigationScreenComponent<{}, NavigationScreenProp<NavigationRoute>> = React.memo((props) => {
  const centeredSubscriptionProductId = props.navigation.getParam('centeredSubscriptionProductId', '')

  return (
    <AppBackground>
      <InteractionManaged>
        <UpgradeContainer centeredSubscriptionProductId={centeredSubscriptionProductId} />
      </InteractionManaged>
    </AppBackground>
  );
})

UpgradeScreen.navigationOptions = (): NavigationStackOptions => {
  return {
    title: 'Upgrade subscription',
    headerLeft: () => null
  };
}
