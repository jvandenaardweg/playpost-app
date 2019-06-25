import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { LoginResetPasswordForm } from '../index';

describe('LoginResetPasswordForm', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<LoginResetPasswordForm onChangeText={() => {}} onPressUpdatePassword={() => {}} resetPasswordToken="" password="" isSuccess={false} isLoading={false} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
