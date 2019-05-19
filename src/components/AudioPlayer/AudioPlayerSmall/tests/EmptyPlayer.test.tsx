import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { EmptyPlayer } from '../EmptyPlayer';

describe('EmptyPlayer', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<EmptyPlayer />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
