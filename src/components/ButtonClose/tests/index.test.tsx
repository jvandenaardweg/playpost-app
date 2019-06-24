import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { ButtonClose } from '../index';

describe('ButtonClose', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<ButtonClose onPress={() => {}} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
