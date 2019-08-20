import React from 'react';
import { fireEvent, render, RenderAPI } from 'react-native-testing-library';

import { PlaybackSpeedSlider } from '../index';

const onSetPlaybackSpeedHandler = jest.fn();

const defaultProps = {
  onSetPlaybackSpeed: onSetPlaybackSpeedHandler,
  playbackSpeed: 1
}

describe('PlaybackSpeedSlider', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;

    const props = {
      ...defaultProps
    }

    beforeAll(() => {
      wrapper = render(<PlaybackSpeedSlider {...props} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should show the correct playback speed label', () => {
      const expected = ['1.00', 'x'];
      expect(wrapper.getByTestId('PlaybackSpeedSlider-Text-label').props.children).toMatchObject(expected);
    });
  });

  describe('interacting', () => {
    let wrapper: RenderAPI;

    const props = {
      ...defaultProps
    }

    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
      wrapper = render(<PlaybackSpeedSlider {...props} />);
    });

    it('should up the playback speed with 0.01 when pressing the plus button', () => {
      fireEvent.press(wrapper.getByTestId('PlaybackSpeedSlider-TouchableHighlight-plus'));
      expect(onSetPlaybackSpeedHandler).toHaveBeenCalledTimes(1);
      expect(onSetPlaybackSpeedHandler).toHaveBeenCalledWith(1.01);
    });

    it('should down the playback speed with 0.01 when pressing the minus button', () => {
      fireEvent.press(wrapper.getByTestId('PlaybackSpeedSlider-TouchableHighlight-minus'));
      expect(onSetPlaybackSpeedHandler).toHaveBeenCalledTimes(1);
      expect(onSetPlaybackSpeedHandler).toHaveBeenCalledWith(0.99);
    });

    it('should reset the playback speed to default when pressing the label', () => {
      // Press the plus once
      fireEvent.press(wrapper.getByTestId('PlaybackSpeedSlider-TouchableHighlight-plus'));
      expect(onSetPlaybackSpeedHandler).toHaveBeenCalledWith(1.01);

      // Reset
      fireEvent.press(wrapper.getByTestId('PlaybackSpeedSlider-TouchableOpacity-label'));
      expect(onSetPlaybackSpeedHandler).toHaveBeenCalledWith(1);
    });
  });
});
