import React from 'react';
import { render, RenderAPI, fireEvent } from 'react-native-testing-library';

import { PlayPauseControl, PlayPauseControlCircle, PlayPauseIcon } from '../index';

describe('PlayPauseControl', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;
    const onPressPlayHandler = jest.fn();

    beforeAll(() => {
      wrapper = render(<PlayPauseControl isPlaying={false} isLoading={false} onPressPlay={onPressPlayHandler} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should trigger onPressPlay when pressing on the button', () => {
      fireEvent.press(wrapper.getByTestId('PlayPauseControl-button'));
      expect(onPressPlayHandler).toHaveBeenCalledTimes(1);
    });
  });
});

describe('PlayPauseControlCircle', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;
    const onPressPlayHandler = jest.fn();

    beforeAll(() => {
      wrapper = render(<PlayPauseControlCircle isPlaying={false} isLoading={false} onPressPlay={onPressPlayHandler} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should trigger onPressPlay when pressing on the button', () => {
      fireEvent.press(wrapper.getByTestId('PlayPauseControlCircle-button'));
      expect(onPressPlayHandler).toHaveBeenCalledTimes(1);
    });
  });
});

describe('PlayPauseIcon', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<PlayPauseIcon isPlaying={false} isLoading={false} size={16} color="white" />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should show the ActivityIndicator when isLoading is true', () => {
      wrapper.update(<PlayPauseIcon isPlaying={false} isLoading={true} size={16} color="white" />);
      expect(wrapper.queryByName('ActivityIndicator')).toBeTruthy();
    });

    it('should not show the ActivityIndicator when isLoading is false', () => {
      wrapper.update(<PlayPauseIcon isPlaying={false} isLoading={false} size={16} color="white" />);
      expect(wrapper.queryByName('ActivityIndicator')).toBeFalsy();
    });

    it('should show an Icon when isPlaying is true', () => {
      wrapper.update(<PlayPauseIcon isPlaying={true} isLoading={false} size={16} color="white" />);
      expect(wrapper.queryByName('Icon')).toBeTruthy();
    });

    it('should show an Icon when isPlaying is false and isLoading is false', () => {
      wrapper.update(<PlayPauseIcon isPlaying={false} isLoading={false} size={16} color="white" />);
      expect(wrapper.queryByName('Icon')).toBeTruthy();
    });
  });
});
