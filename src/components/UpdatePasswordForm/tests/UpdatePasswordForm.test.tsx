import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { UpdatePasswordForm } from '../UpdatePasswordForm';

describe('UpdatePasswordForm', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<UpdatePasswordForm onChangeText={() => {}} onPressUpdatePassword={() => {}} password="" passwordValidation="" isLoading={false} isSuccess={false} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
