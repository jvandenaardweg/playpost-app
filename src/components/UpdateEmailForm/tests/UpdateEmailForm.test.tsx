import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { UpdateEmailForm } from '../UpdateEmailForm';

describe('UpdateEmailForm', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<UpdateEmailForm onChangeText={() => {}} onPressUpdateEmail={() => {}} email="" isLoading={false} isSuccess={false} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
