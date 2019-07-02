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
    const onPressCancelHandler = jest.fn();

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
          onPressCancel={onPressCancelHandler}
        />
      );
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
