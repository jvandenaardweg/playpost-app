import React from 'react';
import { TextInput } from 'react-native';
import { fireEvent, render, RenderAPI } from 'react-native-testing-library';

import { InputGroupPassword, Props } from '../password';

const defaultProps: Props = { }

describe('InputGroupPassword', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeEach(() => {
      const props = {
        ...defaultProps
      }
      wrapper = render(<InputGroupPassword {...props} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });

  describe('interacting', () => {
    let wrapper: RenderAPI;

    beforeEach(() => {
      const props = {
        ...defaultProps
      }
      wrapper = render(<InputGroupPassword {...props} />);
    });

    it('should show the correct eye icon when password should be invisible', () => {
      expect(wrapper.getByTestId('InputGroupPassword-TouchableOpacity-toggle-password-visible-icon').props.name).toBe('eye');
    });

    it('should use the correct TextInput props when password should be hidden (default)', () => {
      expect(wrapper.getByType(TextInput).props.secureTextEntry).toBe(true);
      expect(wrapper.getByType(TextInput).props.textContentType).toBe('password');

    });

    it('should use the correct TextInput props when password should be visible', () => {
      const viewPasswordToggleElement = wrapper.getByTestId('InputGroupPassword-TouchableOpacity-toggle-password-visible');

      fireEvent.press(viewPasswordToggleElement);

      expect(wrapper.getByType(TextInput).props.secureTextEntry).toBe(false);
      expect(wrapper.getByType(TextInput).props.textContentType).toBe('none');
      expect(wrapper.getByTestId('InputGroupPassword-TouchableOpacity-toggle-password-visible-icon').props.name).toBe('eye-off');

    });

  });
});
