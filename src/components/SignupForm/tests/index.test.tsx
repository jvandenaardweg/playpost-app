import React from 'react';
import { fireEvent, render, RenderAPI } from 'react-native-testing-library';

import { URL_PRIVACY_POLICY, URL_TERMS_OF_USE } from '../../../constants/urls';
import { SignupForm } from '../index';

const onPressSignupHandler = jest.fn();
const onChangeTextHandler = jest.fn();
const onPressOpenUrlHandler = jest.fn();

describe('SignupForm', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();

      wrapper = render(
        <SignupForm
          onChangeText={onChangeTextHandler}
          onPressSignup={onPressSignupHandler}
          onPressOpenUrl={onPressOpenUrlHandler}
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

    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();

      wrapper = render(
        <SignupForm
          onChangeText={onChangeTextHandler}
          onPressSignup={onPressSignupHandler}
          onPressOpenUrl={onPressOpenUrlHandler}
          email=""
          password=""
          isLoading={false}
        />
      );
    });

    it('should fire onPressSignup when the signup button is pressed', () => {
      fireEvent.press(wrapper.getByTestId('SignupForm-Button-signup'));
      expect(onPressSignupHandler).toHaveBeenCalledTimes(1);
    });

    it('should fire onPressPrivacyPolicy when the Privacy Policy button is pressed', () => {
      fireEvent.press(wrapper.getByTestId('SignupForm-Text-privacy-policy'));
      expect(onPressOpenUrlHandler).toHaveBeenCalledTimes(1);
      expect(onPressOpenUrlHandler).toHaveBeenCalledWith(URL_PRIVACY_POLICY);
    });

    it('should fire onPressTerms when the Terms of Use button is pressed', () => {
      fireEvent.press(wrapper.getByTestId('SignupForm-Text-terms'));
      expect(onPressOpenUrlHandler).toHaveBeenCalledTimes(1);
      expect(onPressOpenUrlHandler).toHaveBeenCalledWith(URL_TERMS_OF_USE);
    });

    it('should fire onChangeText when filling in a TextInput', () => {
      const exampleEmail = 'jordyvandenaardweg@gmail.com';
      const emailTextInput = wrapper.getByTestId('SignupForm-TextInput-email');

      fireEvent.changeText(emailTextInput, exampleEmail);
      expect(onChangeTextHandler).toHaveBeenCalledWith('email', exampleEmail);
    });

    it('should fire onChangeTextHandler when filling in a TextInput', () => {
      const examplePassword = 'p@ssword!';
      const passwordTextInput = wrapper.getByTestId('SignupForm-TextInput-password');

      fireEvent.changeText(passwordTextInput, examplePassword);
      expect(onChangeTextHandler).toHaveBeenCalledWith('password', examplePassword);
    });

    it('should disable the signup button if isLoading is true', () => {
      wrapper.update(
        <SignupForm
          onChangeText={onChangeTextHandler}
          onPressSignup={onPressSignupHandler}
          onPressOpenUrl={onPressOpenUrlHandler}
          email=""
          password=""
          isLoading={true}
        />
      );

      expect(wrapper.getByTestId('SignupForm-Button-signup').props.disabled).toBe(true);
    });
  });
});
