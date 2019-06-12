import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { ButtonReload } from '../index';

describe('ButtonReload', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<ButtonReload onPress={() => {}} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
