import React from 'react';
import { fireEvent, render, RenderAPI } from 'react-native-testing-library';

import { ButtonVoices } from '../index';

describe('ButtonVoices', () => {
  let wrapper: RenderAPI;
  const onPressHandler = jest.fn();

  describe('rendering', () => {
    beforeAll(() => {
      wrapper = render(<ButtonVoices onPress={onPressHandler} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });

  describe('interacting', () => {
    beforeAll(() => {
      wrapper = render(<ButtonVoices onPress={onPressHandler} />);
    });

    it('should fire onPress when the button is pressed', () => {
      fireEvent.press(wrapper.getByTestId('ButtonVoices-button'));
      expect(onPressHandler).toHaveBeenCalledTimes(1);
    });
  });
});
