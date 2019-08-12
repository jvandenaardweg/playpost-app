import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { SmallAudioPlayerContainerComponent } from '../SmallAudioPlayerContainer';

import articleMock from '../../../tests/__mocks__/article';

jest.mock('appcenter-analytics');
jest.mock('../../navigation/NavigationService');

const setPlaybackStatusHandler = jest.fn();
const setPlaybackSpeedHandler = jest.fn();
const navigateHandler = jest.fn();
const navigationGetParamHandler = jest.fn();
const navigationGoBackHandler = jest.fn();

const defaultProps: any = {
  track: {},
  userPlaybackSpeed: 1,
  userHasSubscribedBefore: false,
  articles: [],
  playerIsPlaying: false,
  playerIsLoading: false,
  setPlaybackStatus: setPlaybackStatusHandler,
  setPlaybackSpeed: setPlaybackSpeedHandler,
  navigation: {
    navigate: navigateHandler,
    getParam: navigationGetParamHandler,
    goBack: navigationGoBackHandler,
  },
};

describe('SmallAudioPlayerContainer', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeEach(() => {

      const props = {
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
      const props = {
        ...defaultProps,
        articles: [articleMock] // simulate 1 article in an array
      }
      wrapper.update(<SmallAudioPlayerContainerComponent {...props} />);
      expect(wrapper.queryByTestId('AudioPlayerSmallEmpty')).toBeTruthy();
      expect(wrapper.getByTestId('AudioPlayerSmallEmpty-Text-empty').props.children).toBe('Select an article to listen');
    });
  });
});
