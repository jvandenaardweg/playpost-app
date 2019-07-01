import React from 'react';
import { render, RenderAPI, fireEvent } from 'react-native-testing-library';

import { LoginResetPasswordForm } from '../index';

describe('LoginResetPasswordForm', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;
    const onChangeTextHandler = jest.fn();
    const onPressUpdatePasswordHandler = jest.fn();

    beforeEach(() => {
      wrapper = render(
        <LoginResetPasswordForm
          onChangeText={onChangeTextHandler}
          onPressUpdatePassword={onPressUpdatePasswordHandler}
          password=""
          resetPasswordToken=""
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
    const onPressUpdatePasswordHandler = jest.fn();

    beforeEach(() => {
      wrapper = render(
        <LoginResetPasswordForm
          onChangeText={onChangeTextHandler}
          onPressUpdatePassword={onPressUpdatePasswordHandler}
          password=""
          resetPasswordToken=""
          isLoading={false}
          isSuccess={false}
        />
      );
    });

    it('should fire onPressUpdatePassword when the "reset my password" button is pressed', () => {
      fireEvent.press(wrapper.getByTestId('LoginResetPasswordForm-Button-update-password'));
      expect(onPressUpdatePasswordHandler).toHaveBeenCalledTimes(1);
    });

    it('should fire onChangeText when filling in the reset token TextInput', () => {
      const exampleResetToken = '123ABC';
      const resetTokenTextInput = wrapper.getByTestId('LoginResetPasswordForm-TextInput-reset-password-code');

      fireEvent.changeText(resetTokenTextInput, exampleResetToken);
      expect(onChangeTextHandler).toHaveBeenCalledWith('resetPasswordToken', exampleResetToken);
    });

    it('should fire onChangeText when filling in the password TextInput', () => {
      const examplePassword = 'p@ssWord!';
      const passwordTextInput = wrapper.getByTestId('LoginResetPasswordForm-TextInput-password');

      fireEvent.changeText(passwordTextInput, examplePassword);
      expect(onChangeTextHandler).toHaveBeenCalledWith('password', examplePassword);
    });

    it('should disable the buttons if isLoading is true', () => {
      wrapper.update(
        <LoginResetPasswordForm
          onChangeText={onChangeTextHandler}
          onPressUpdatePassword={onPressUpdatePasswordHandler}
          password=""
          resetPasswordToken=""
          isLoading={true}
          isSuccess={false}
        />
      );

      expect(wrapper.getByTestId('LoginResetPasswordForm-Button-update-password').props.disabled).toBe(true);
    });

    it('should disable the buttons if isSuccess is true', () => {
      wrapper.update(
        <LoginResetPasswordForm
          onChangeText={onChangeTextHandler}
          onPressUpdatePassword={onPressUpdatePasswordHandler}
          password=""
          resetPasswordToken=""
          isLoading={false}
          isSuccess={true}
        />
      );

      expect(wrapper.getByTestId('LoginResetPasswordForm-Button-update-password').props.disabled).toBe(true);
    });
  });
});
