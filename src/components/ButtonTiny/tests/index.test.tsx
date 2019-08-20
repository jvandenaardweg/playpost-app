import React from 'react';
import { fireEvent, render, RenderAPI } from 'react-native-testing-library';

import { ButtonTiny } from '../index';

describe('ButtonTiny', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;
    const onPressHandler = jest.fn();

    beforeAll(() => {
      wrapper = render(<ButtonTiny onPress={onPressHandler} label="Test" />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should fire onPress when the button is pressed', () => {
      fireEvent.press(wrapper.getByTestId('ButtonTiny-Button'));
      expect(onPressHandler).toHaveBeenCalledTimes(1);
    });
  });
});
