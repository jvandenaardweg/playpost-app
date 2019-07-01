import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { GlobalStatusIndicator } from '../index';

describe('GlobalStatusIndicator', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(
        <GlobalStatusIndicator label="Creating article audio..." />
      );
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
