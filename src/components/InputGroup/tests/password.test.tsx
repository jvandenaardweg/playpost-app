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

    it('should render correctly render the correct default label', () => {
      expect(wrapper.getByTestId('InputGroup-Text-label').props.children).toBe('Password');
    });

    it('should render correctly render the correct custom label', () => {
      const props = {
        ...defaultProps,
        label: 'Your new password'
      }

      wrapper.update(<InputGroupPassword {...props} />);

      expect(wrapper.getByTestId('InputGroup-Text-label').props.children).toBe('Your new password');
    });

    it('should show the correct eye icon when password should be invisible', () => {
      expect(wrapper.getByTestId('InputGroupPassword-TouchableOpacity-toggle-password-visible-icon').props.name).toBe('eye');
    });

    it('should use the correct TextInput props when password should be hidden (default)', () => {
      expect(wrapper.getByType(TextInput).props.secureTextEntry).toBe(true);
      expect(wrapper.getByType(TextInput).props.textContentType).toBe('password');
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



    it('should use the correct TextInput props when password should be visible', () => {
      const viewPasswordToggleElement = wrapper.getByTestId('InputGroupPassword-TouchableOpacity-toggle-password-visible');

      fireEvent.press(viewPasswordToggleElement);

      expect(wrapper.getByType(TextInput).props.secureTextEntry).toBe(false);
      expect(wrapper.getByType(TextInput).props.textContentType).toBe('none');
      expect(wrapper.getByTestId('InputGroupPassword-TouchableOpacity-toggle-password-visible-icon').props.name).toBe('eye-off');

    });

  });
});
