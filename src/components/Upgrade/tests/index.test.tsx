import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { Upgrade } from '../index';

describe('Upgrade', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;
    const onPressUpgradeHandler = jest.fn();
    const onPressRestoreHandler = jest.fn();
    const onPressPrivacyHandler = jest.fn();
    const onPressTermsHandler = jest.fn();

    beforeAll(() => {
      wrapper = render(
        <Upgrade
          isLoadingSubscriptionItems={false}
          isLoadingBuySubscription={false}
          isLoadingRestorePurchases={false}
          subscriptions={[]}
          activeSubscriptionProductId={'free'}
          subscriptionFeatures={[]}
          onPressUpgrade={onPressUpgradeHandler}
          onPressRestore={onPressRestoreHandler}
          onPressPrivacy={onPressPrivacyHandler}
          onPressTerms={onPressTermsHandler}
        />
      );
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
