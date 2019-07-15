import React from 'react';
import { fireEvent, render, RenderAPI } from 'react-native-testing-library';

import { UpdatePasswordForm } from '../index';

describe('UpdatePasswordForm', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;
    const onChangeTextHandler = jest.fn();
    const onPressUpdatePasswordHandler = jest.fn();

    beforeEach(() => {
      wrapper = render(
        <UpdatePasswordForm
          onChangeText={onChangeTextHandler}
          onPressUpdatePassword={onPressUpdatePasswordHandler}
          password=""
          passwordValidation=""
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
        <UpdatePasswordForm
          onChangeText={onChangeTextHandler}
          onPressUpdatePassword={onPressUpdatePasswordHandler}
          password=""
          passwordValidation=""
          isLoading={false}
          isSuccess={false}
        />
      );
    });

    it('should fire onChangeText when filling in the password TextInput', () => {
      const examplePassword = 'p@ssW0rd!';
      const passwordTextInput = wrapper.getByTestId('UpdatePasswordForm-TextInput-password');

      fireEvent.changeText(passwordTextInput, examplePassword);
      expect(onChangeTextHandler).toHaveBeenCalledWith('password', examplePassword);
    });

    it('should fire onChangeText when filling in the password validation TextInput', () => {
      const examplePassword = 'p@ssW0rd!';
      const passwordValidationTextInput = wrapper.getByTestId('UpdatePasswordForm-TextInput-password-validation');

      fireEvent.changeText(passwordValidationTextInput, examplePassword);
      expect(onChangeTextHandler).toHaveBeenCalledWith('passwordValidation', examplePassword);
    });

    it('should disable the buttons if isLoading is true', () => {
      wrapper.update(
        <UpdatePasswordForm
          onChangeText={onChangeTextHandler}
          onPressUpdatePassword={onPressUpdatePasswordHandler}
          password=""
          passwordValidation=""
          isLoading={true}
          isSuccess={false}
        />
      );

      expect(wrapper.getByTestId('UpdatePasswordForm-Button-update').props.disabled).toBe(true);
    });

    it('should disable the buttons if isSuccess is true', () => {
      wrapper.update(
        <UpdatePasswordForm
          onChangeText={onChangeTextHandler}
          onPressUpdatePassword={onPressUpdatePasswordHandler}
          password=""
          passwordValidation=""
          isLoading={false}
          isSuccess={true}
        />
      );

      expect(wrapper.getByTestId('UpdatePasswordForm-Button-update').props.disabled).toBe(true);
    });
  });
});
