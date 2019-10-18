import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { GlobalStatusIndicator, Props } from '../index';

const defaultProps: Props = {
  audiofileStatus: '',
  playlistIsLoadingCreateItem: false
}

describe('GlobalStatusIndicator', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      const props = {
        ...defaultProps,
      }
      wrapper = render(<GlobalStatusIndicator {...props} />);
    });

    it('should render "Creating article audio..."', () => {
      const props = {
        ...defaultProps,
        audiofileStatus: 'Creating article audio...',
        playlistIsLoadingCreateItem: false
      }

      wrapper.update(<GlobalStatusIndicator {...props} />);

      expect(wrapper.getByTestId('GlobalStatusIndicator-label').props.children).toBe('Creating article audio...');
    });

    it('should render "Adding article..."', () => {
      const props = {
        ...defaultProps,
        playlistIsLoadingCreateItem: true
      }

      wrapper.update(<GlobalStatusIndicator {...props} />);

      expect(wrapper.getByTestId('GlobalStatusIndicator-label').props.children).toBe('Adding article...');
    });

    it('should use a fallback label when label is not set', () => {
      const props = {
        ...defaultProps,
        playlistIsLoadingCreateItem: false
      }

      wrapper.rerender(<GlobalStatusIndicator {...props} />);

      expect(wrapper.getByTestId('GlobalStatusIndicator-label').props.children).toBe('Loading...');
    });
  });
});
