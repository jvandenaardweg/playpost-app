import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { GlobalStatusIndicator } from '../index';

describe('GlobalStatusIndicator', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<GlobalStatusIndicator label={'Creating article audio...'} isActive />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render "Creating article audio..."', () => {
      expect(wrapper.getByTestId('GlobalStatusIndicator-label').props.children).toBe('Creating article audio...');
    });

    it('should use a fallback label when label is not set', () => {
      wrapper = render(<GlobalStatusIndicator isActive />);
      expect(wrapper.getByTestId('GlobalStatusIndicator-label').props.children).toBe('Loading...');
    });
  });
});
