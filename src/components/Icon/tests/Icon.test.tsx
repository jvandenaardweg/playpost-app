import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import * as Icon from '../Icon';

describe('Icon', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<Icon.FontAwesome name="heart" />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
