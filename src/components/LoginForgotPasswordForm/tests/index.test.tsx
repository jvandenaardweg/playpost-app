import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { LoginForgotPasswordForm } from '../index';

describe('LoginForgotPasswordForm', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<LoginForgotPasswordForm onChangeText={() => {}} onPressResetPassword={() => {}} onPressResetPasswordCode={() => {}} isSuccess={false} email="" isLoading={false} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
