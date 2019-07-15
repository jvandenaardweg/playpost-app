import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { ButtonUpgrade } from '../index';

describe('ButtonUpgrade', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;
    const onPressHandler = jest.fn();

    beforeAll(() => {
      wrapper = render(<ButtonUpgrade onPress={onPressHandler} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
