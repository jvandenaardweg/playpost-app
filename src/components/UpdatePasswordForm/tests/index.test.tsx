import React from 'react';
import { fireEvent, render, RenderAPI } from 'react-native-testing-library';

import { Props, UpdatePasswordForm } from '../index';

const onChangeTextHandler = jest.fn();
const onPressUpdatePasswordHandler = jest.fn();

const defaultProps: Props = {
  onChangeText: onChangeTextHandler,
  onPressUpdatePassword: onPressUpdatePasswordHandler,
  password: '',
  isLoading: false,
  isSuccess: false,
}

describe('UpdatePasswordForm', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeEach(() => {
      const props = {
        ...defaultProps
      }

      wrapper = render(<UpdatePasswordForm {...props} />);
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

      wrapper = render(<UpdatePasswordForm {...props} />);
    });

    it('should fire onChangeText when filling in the password TextInput', () => {
      const examplePassword = 'p@ssW0rd!';
      const passwordTextInput = wrapper.getByTestId('UpdatePasswordForm-TextInput-password');

      fireEvent.changeText(passwordTextInput, examplePassword);
      expect(onChangeTextHandler).toHaveBeenCalledWith('password', examplePassword);
    });

    it('should disable the buttons if isLoading is true', () => {
      const props = {
        ...defaultProps,
        isLoading: true
      }

      wrapper.update(<UpdatePasswordForm {...props} />);

      expect(wrapper.getByTestId('UpdatePasswordForm-Button-update').props.disabled).toBe(true);
    });

    it('should disable the buttons if isSuccess is true', () => {
      const props = {
        ...defaultProps,
        isSuccess: true
      }

      wrapper.update(<UpdatePasswordForm {...props} />);

      expect(wrapper.getByTestId('UpdatePasswordForm-Button-update').props.disabled).toBe(true);
    });
  });
});
