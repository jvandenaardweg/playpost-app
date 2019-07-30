import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { ContentView } from '../index';

const onPressSupportHandler = jest.fn();

describe('ContentView', () => {
  describe('basic rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<ContentView onPressSupport={onPressSupportHandler} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
