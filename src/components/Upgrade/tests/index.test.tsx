import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { SUBSCRIPTION_PRODUCT_ID_FREE, SUBSCRIPTION_PRODUCT_ID_PREMIUM } from '../../../constants/in-app-purchase';
import { Upgrade } from '../index';

describe('Upgrade', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;
    const onPressUpgradeHandler = jest.fn();
    const onPressRestoreHandler = jest.fn();
    const onPressPrivacyHandler = jest.fn();
    const onPressTermsHandler = jest.fn();
    const onPressCancelHandler = jest.fn();
    const isDowngradePaidSubscription = jest.fn();

    beforeAll(() => {
      wrapper = render(
        <Upgrade
          isLoadingSubscriptionItems={false}
          isLoadingBuySubscription={false}
          isLoadingRestorePurchases={false}
          isEligibleForTrial={true}
          subscriptions={[]}
          activeSubscriptionProductId={SUBSCRIPTION_PRODUCT_ID_FREE}
          centeredSubscriptionProductId={SUBSCRIPTION_PRODUCT_ID_PREMIUM}
          subscriptionFeatures={[]}
          onPressUpgrade={onPressUpgradeHandler}
          onPressRestore={onPressRestoreHandler}
          onPressPrivacy={onPressPrivacyHandler}
          onPressTerms={onPressTermsHandler}
          onPressCancel={onPressCancelHandler}
          isDowngradePaidSubscription={isDowngradePaidSubscription}
        />
      );
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
