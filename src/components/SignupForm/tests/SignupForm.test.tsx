import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { SignupForm } from '../SignupForm';

describe('SignupForm', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<SignupForm onChangeText={() => {}} onPressLogin={() => {}} onPressSignup={() => {}} email="" password="" passwordValidation="" isLoading={false} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
