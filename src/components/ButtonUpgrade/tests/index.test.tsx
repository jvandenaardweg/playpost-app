import React from 'react';
import { fireEvent, render, RenderAPI } from 'react-native-testing-library';

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

    it('should fire onPress when the button is pressed', () => {
      fireEvent.press(wrapper.getByTestId('ButtonTiny-Button'));
      expect(onPressHandler).toHaveBeenCalledTimes(1);
    });
  });
});
