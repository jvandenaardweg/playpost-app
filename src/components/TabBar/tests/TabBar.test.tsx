import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { TabBarIcon } from '../TabBarIcon';

describe('TabBarIcon', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<TabBarIcon focused={false} name="archive" />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
