import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { CenterLoadingIndicator } from '../index';

describe('CenterLoadingIndicator', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<CenterLoadingIndicator />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
