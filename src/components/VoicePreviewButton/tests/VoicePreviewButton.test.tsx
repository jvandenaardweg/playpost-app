import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { VoicePreviewButton } from '../VoicePreviewButton';

describe('VoicePreviewButton', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<VoicePreviewButton onPress={() => {}} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
