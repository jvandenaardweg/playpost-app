import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { ButtonVoicePreview } from '../index';

describe('ButtonVoicePreview', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;
    const onPressHandler = jest.fn();

    beforeAll(() => {
      wrapper = render(<ButtonVoicePreview onPress={onPressHandler} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
