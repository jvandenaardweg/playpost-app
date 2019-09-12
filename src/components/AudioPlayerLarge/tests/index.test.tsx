import React from 'react';

// tslint:disable-next-line: no-submodule-imports
import * as ShallowRenderer from 'react-test-renderer/shallow';

import articleMock from '../../../../tests/__mocks__/article';
import { AudioPlayerLarge, Props } from '../index';

const onSetPlaybackSpeedHandler = jest.fn();
const onPressPlayHandler = jest.fn();
const onProgressChangeHandler = jest.fn();
const onTogglePlaybackSpeedVisibilityHandler = jest.fn();
const onPressJumpForwardHandler = jest.fn();
const onPressJumpBackwardHandler = jest.fn();
const onPressVoiceHandler = jest.fn();

const defaultProps: Props = {
  onSetPlaybackSpeed: onSetPlaybackSpeedHandler,
  onPressPlay: onPressPlayHandler,
  onProgressChange: onProgressChangeHandler,
  onTogglePlaybackSpeedVisibility: onTogglePlaybackSpeedVisibilityHandler,
  onPressJumpForward: onPressJumpForwardHandler,
  onPressJumpBackward: onPressJumpBackwardHandler,
  onPressVoice: onPressVoiceHandler,
  playbackSpeed: 1,
  isPlaying: false,
  isLoading: false,
  isPlaybackSpeedVisible: false,
  article: articleMock
}

describe('AudioPlayerLarge', () => {
  describe('rendering', () => {
    let wrapper: any;

    const props = {
      ...defaultProps
    }

    beforeAll(() => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<AudioPlayerLarge {...props} />);
      wrapper = renderer.getRenderOutput();
    });

    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  // describe('interacting', () => {
  //   let wrapper: RenderAPI;

  //   const props = {
  //     ...defaultProps
  //   }

  //   beforeEach(() => {
  //     jest.resetAllMocks();
  //     jest.restoreAllMocks();
  //     wrapper = render(<PlaybackSpeedSlider {...props} />);
  //   });

  //   it('should up the playback speed with 0.01 when pressing the plus button', () => {
  //     fireEvent.press(wrapper.getByTestId('PlaybackSpeedSlider-TouchableHighlight-plus'));
  //     expect(onSetPlaybackSpeedHandler).toHaveBeenCalledTimes(1);
  //     expect(onSetPlaybackSpeedHandler).toHaveBeenCalledWith(1.01);
  //   });

  //   it('should down the playback speed with 0.01 when pressing the minus button', () => {
  //     fireEvent.press(wrapper.getByTestId('PlaybackSpeedSlider-TouchableHighlight-minus'));
  //     expect(onSetPlaybackSpeedHandler).toHaveBeenCalledTimes(1);
  //     expect(onSetPlaybackSpeedHandler).toHaveBeenCalledWith(0.99);
  //   });

  //   it('should reset the playback speed to default when pressing the label', () => {
  //     // Press the plus once
  //     fireEvent.press(wrapper.getByTestId('PlaybackSpeedSlider-TouchableHighlight-plus'));
  //     expect(onSetPlaybackSpeedHandler).toHaveBeenCalledWith(1.01);

  //     // Reset
  //     fireEvent.press(wrapper.getByTestId('PlaybackSpeedSlider-Text-label'));
  //     expect(onSetPlaybackSpeedHandler).toHaveBeenCalledWith(1);
  //   });
  // });
});
