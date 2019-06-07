import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { AudioPlayerSmallEmpty } from '../index';

describe('AudioPlayerSmallEmpty', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<AudioPlayerSmallEmpty />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
