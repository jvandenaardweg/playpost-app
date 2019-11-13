import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { GlobalStatusIndicator, IProps } from '../index';

const defaultProps: IProps = {
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

    it('should use a fallback label when label is not set', () => {
      const props = {
        ...defaultProps,
        audiofileStatus: '',
        playlistIsLoadingCreateItem: false
      }

      wrapper = render(<GlobalStatusIndicator {...props} />);

      expect(wrapper.getByTestId('GlobalStatusIndicator-label').props.children).toBe('');
    });

    it('should render "Adding article..."', () => {
      const props = {
        ...defaultProps,
        playlistIsLoadingCreateItem: true
      }

      wrapper = render(<GlobalStatusIndicator {...props} />);

      expect(wrapper.getByTestId('GlobalStatusIndicator-label').props.children).toBe('Adding article...');
    });

  });
});
