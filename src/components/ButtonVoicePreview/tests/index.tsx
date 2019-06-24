import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { ButtonVoicePreview } from '../index';

describe('ButtonVoicePreview', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<ButtonVoicePreview onPress={() => {}} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
