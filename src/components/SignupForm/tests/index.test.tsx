import React from 'react';
import { fireEvent, render, RenderAPI } from 'react-native-testing-library';

import { SignupForm } from '../index';

describe('SignupForm', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;
    const onPressSignupHandler = jest.fn();
    const onChangeTextHandler = jest.fn();
    const onPressPrivacyPolicyHandler = jest.fn();
    const onPressTermsHandler = jest.fn();

    beforeEach(() => {
      wrapper = render(
        <SignupForm
          onChangeText={onChangeTextHandler}
          onPressSignup={onPressSignupHandler}
          onPressPrivacyPolicy={onPressPrivacyPolicyHandler}
          onPressTerms={onPressTermsHandler}
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
    const onPressSignupHandler = jest.fn();
    const onChangeTextHandler = jest.fn();
    const onPressPrivacyPolicyHandler = jest.fn();
    const onPressTermsHandler = jest.fn();

    beforeEach(() => {
      wrapper = render(
        <SignupForm
          onChangeText={onChangeTextHandler}
          onPressSignup={onPressSignupHandler}
          onPressPrivacyPolicy={onPressPrivacyPolicyHandler}
          onPressTerms={onPressTermsHandler}
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
      expect(onPressPrivacyPolicyHandler).toHaveBeenCalledTimes(1);
    });

    it('should fire onPressTerms when the Terms of Use button is pressed', () => {
      fireEvent.press(wrapper.getByTestId('SignupForm-Text-terms'));
      expect(onPressTermsHandler).toHaveBeenCalledTimes(1);
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
          onPressPrivacyPolicy={onPressPrivacyPolicyHandler}
          onPressTerms={onPressTermsHandler}
          email=""
          password=""
          isLoading={true}
        />
      );

      expect(wrapper.getByTestId('SignupForm-Button-signup').props.disabled).toBe(true);
    });
  });
});
