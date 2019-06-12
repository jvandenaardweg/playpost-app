import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { PlayPauseControl } from '../index';

describe('PlayPauseControl', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<PlayPauseControl isPlaying={false} isLoading={false} onPressPlay={() => {}} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
