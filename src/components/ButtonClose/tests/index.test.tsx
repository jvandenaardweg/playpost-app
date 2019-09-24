import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { ButtonClose } from '../index';

describe('ButtonClose', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;
    const onPressHandler = jest.fn();

    beforeAll(() => {
      wrapper = render(<ButtonClose theme="light" onPress={onPressHandler} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
