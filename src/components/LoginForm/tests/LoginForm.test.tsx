import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { LoginForm } from '../LoginForm';

describe('LoginForm', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<LoginForm onChangeText={() => {}} onPressLogin={() => {}} onPressSignup={() => {}} email="" password="" error="" isLoading={false} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
