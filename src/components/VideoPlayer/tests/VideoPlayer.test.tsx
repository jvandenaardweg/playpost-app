import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { VideoPlayer } from '../VideoPlayer';

describe('VideoPlayer', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<VideoPlayer />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
