import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { ButtonUpgrade } from '../index';

describe('ButtonUpgrade', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<ButtonUpgrade onPress={() => {}} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
