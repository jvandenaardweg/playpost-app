import React from 'react';
import { fireEvent, render, RenderAPI } from 'react-native-testing-library';

import { LoginForm } from '../index';

describe('LoginForm', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;
    const onPressLoginHandler = jest.fn();
    const onChangeTextHandler = jest.fn();
    const onPressForgotPasswordHandler = jest.fn();

    beforeEach(() => {
      wrapper = render(
        <LoginForm
          onChangeText={onChangeTextHandler}
          onPressLogin={onPressLoginHandler}
          onPressForgotPassword={onPressForgotPasswordHandler}
          email=""
          password=""
          isLoading={false}
        />
      );
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });

  describe('interacting', () => {
    let wrapper: RenderAPI;
    const onPressLoginHandler = jest.fn();
    const onChangeTextHandler = jest.fn();
    const onPressForgotPasswordHandler = jest.fn();

    beforeEach(() => {
      wrapper = render(
        <LoginForm
          onChangeText={onChangeTextHandler}
          onPressLogin={onPressLoginHandler}
          onPressForgotPassword={onPressForgotPasswordHandler}
          email=""
          password=""
          isLoading={false}
        />
      );
    });

    it('should fire onPressLogin when the login button is pressed', () => {
      fireEvent.press(wrapper.getByTestId('LoginForm-Button-login'));
      expect(onPressLoginHandler).toHaveBeenCalledTimes(1);
    });

    it('should fire onPressForgotPassword when the forgot password button is pressed', () => {
      fireEvent.press(wrapper.getByTestId('LoginForm-Button-forgot-password'));
      expect(onPressForgotPasswordHandler).toHaveBeenCalledTimes(1);
    });

    it('should fire onChangeText when filling in a TextInput', () => {
      const exampleEmail = 'jordyvandenaardweg@gmail.com';
      const emailTextInput = wrapper.getByTestId('LoginForm-TextInput-email');

      fireEvent.changeText(emailTextInput, exampleEmail);
      expect(onChangeTextHandler).toHaveBeenCalledWith('email', exampleEmail);
    });

    it('should fire onChangeTextHandler when filling in a TextInput', () => {
      const examplePassword = 'p@ssword!';
      const passwordTextInput = wrapper.getByTestId('LoginForm-TextInput-password');

      fireEvent.changeText(passwordTextInput, examplePassword);
      expect(onChangeTextHandler).toHaveBeenCalledWith('password', examplePassword);
    });

    it('should disable the signup button if isLoading is true', () => {
      wrapper.update(
        <LoginForm
          onChangeText={onChangeTextHandler}
          onPressLogin={onPressLoginHandler}
          onPressForgotPassword={onPressForgotPasswordHandler}
          email=""
          password=""
          isLoading={true}
        />
      );

      expect(wrapper.getByTestId('LoginForm-Button-login').props.disabled).toBe(true);
    });
  });
});
