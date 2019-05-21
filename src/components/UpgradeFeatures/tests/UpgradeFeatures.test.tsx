import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { UpgradeFeatures } from '../UpgradeFeatures';

describe('UpgradeFeatures', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<UpgradeFeatures onClose={() => {}} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
