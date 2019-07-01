import React from 'react';
import { render, RenderAPI, fireEvent } from 'react-native-testing-library';

import { LoginForgotPasswordForm } from '../index';

describe('LoginForgotPasswordForm', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;
    const onChangeTextHandler = jest.fn();
    const onPressResetPasswordHandler = jest.fn();
    const onPressResetPasswordCodeHandler = jest.fn();

    beforeEach(() => {
      wrapper = render(
        <LoginForgotPasswordForm
          onChangeText={onChangeTextHandler}
          onPressResetPassword={onPressResetPasswordHandler}
          onPressResetPasswordCode={onPressResetPasswordCodeHandler}
          email=""
          isLoading={false}
          isSuccess={false}
        />
      );
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });

  describe('interacting', () => {
    let wrapper: RenderAPI;
    const onChangeTextHandler = jest.fn();
    const onPressResetPasswordHandler = jest.fn();
    const onPressResetPasswordCodeHandler = jest.fn();

    beforeEach(() => {
      wrapper = render(
        <LoginForgotPasswordForm
          onChangeText={onChangeTextHandler}
          onPressResetPassword={onPressResetPasswordHandler}
          onPressResetPasswordCode={onPressResetPasswordCodeHandler}
          email=""
          isLoading={false}
          isSuccess={false}
        />
      );
    });

    it('should fire onPressResetPassword when the "reset my password" button is pressed', () => {
      fireEvent.press(wrapper.getByTestId('LoginForgotPasswordForm-Button-reset-password'));
      expect(onPressResetPasswordHandler).toHaveBeenCalledTimes(1);
    });

    it('should fire onPressResetPasswordCode when the "already got a reset code" button is pressed', () => {
      fireEvent.press(wrapper.getByTestId('LoginForgotPasswordForm-Button-reset-password-code'));
      expect(onPressResetPasswordCodeHandler).toHaveBeenCalledTimes(1);
    });

    it('should fire onChangeText when filling in a TextInput', () => {
      const exampleEmail = 'jordyvandenaardweg@gmail.com';
      const emailTextInput = wrapper.getByTestId('LoginForgotPasswordForm-TextInput-email');

      fireEvent.changeText(emailTextInput, exampleEmail);
      expect(onChangeTextHandler).toHaveBeenCalledWith('email', exampleEmail);
    });

    it('should disable the buttons if isLoading is true', () => {
      wrapper.update(
        <LoginForgotPasswordForm
          onChangeText={onChangeTextHandler}
          onPressResetPassword={onPressResetPasswordHandler}
          onPressResetPasswordCode={onPressResetPasswordCodeHandler}
          email=""
          isLoading={true}
          isSuccess={false}
        />
      );

      expect(wrapper.getByTestId('LoginForgotPasswordForm-Button-reset-password').props.disabled).toBe(true);
      expect(wrapper.getByTestId('LoginForgotPasswordForm-Button-reset-password-code').props.disabled).toBe(true);
    });
  });
});
