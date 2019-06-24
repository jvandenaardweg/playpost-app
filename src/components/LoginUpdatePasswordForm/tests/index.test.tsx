import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { LoginUpdatePasswordForm } from '../index';

describe('LoginUpdatePasswordForm', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<LoginUpdatePasswordForm onChangeText={() => {}} onPressUpdatePassword={() => {}} resetPasswordToken="" password="" isSuccess={false} isLoading={false} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
