import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { Props, SmallAudioPlayerContainerComponent } from '../SmallAudioPlayerContainer';

import articleMock from '../../../tests/__mocks__/article';

jest.mock('../../navigation/NavigationService');

import { initialTrackState } from '../../reducers/player';

const setPlaybackStatusHandler = jest.fn();
const setPlaybackSpeedHandler = jest.fn();

const defaultProps: Props = {
  track: initialTrackState,
  userPlaybackSpeed: 1,
  articles: [],
  playerIsPlaying: false,
  playerIsLoading: false,

  setPlaybackStatus: setPlaybackStatusHandler,
  setPlaybackSpeed: setPlaybackSpeedHandler
};

describe('SmallAudioPlayerContainer', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeEach(() => {

      const props: Props = {
        ...defaultProps
      }

      wrapper = render(<SmallAudioPlayerContainerComponent {...props} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should not render an element when there are not articles yet', () => {
      expect(wrapper.toJSON()).toBe(null);
    });

    it('should render an empty element with the correct empty text', () => {
      const props: Props = {
        ...defaultProps,
        articles: [articleMock] // simulate 1 article in an array
      }

      wrapper.update(<SmallAudioPlayerContainerComponent {...props} />);
      expect(wrapper.queryByTestId('AudioPlayerSmallEmpty')).toBeTruthy();
      expect(wrapper.getByTestId('AudioPlayerSmallEmpty-Text-empty').props.children).toBe('Select an article to listen');
    });
  });
});
