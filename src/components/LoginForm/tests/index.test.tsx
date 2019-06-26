import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { LoginForm } from '../index';

describe('LoginForm', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<LoginForm onChangeText={() => {}} onPressLogin={() => {}} onPressForgotPassword={() => {}} email="" password="" isLoading={false} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
