import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { Upgrade } from '../index';

describe('Upgrade', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(
        <Upgrade
          isLoadingBuySubscription={false}
          isLoadingRestorePurchases={false}
          onPressUpgrade={() => {}}
          onPressRestore={() => {}}
          upgradeButtonTitle="Upgrade for 1 euro"
        />
      );
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
