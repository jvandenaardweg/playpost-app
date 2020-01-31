import React from 'react';
import { fireEvent, render, RenderAPI } from 'react-native-testing-library';

import colors from '../../../constants/colors';
import { ButtonVoicePreview } from '../index';

const onPressHandler = jest.fn();

const defaultProps = {
  isLoading: false,
  isPlaying: false,
  isActive: false,
  isAvailable: false,
  onPress: onPressHandler
}

describe('ButtonVoicePreview', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      const props = {
        ...defaultProps
      }

      wrapper = render(<ButtonVoicePreview {...props} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should fire onPress when the button is pressed', () => {
      fireEvent.press(wrapper.getByTestId('ButtonViewPreview-TouchableOpacity'));
      expect(onPressHandler).toHaveBeenCalledTimes(1);
    });

    it('should render a ActivityIndicator when loading', () => {
      const props = {
        ...defaultProps,
        isLoading: true
      }

      wrapper.update(<ButtonVoicePreview {...props} />);
      expect(wrapper.getByTestId('ButtonViewPreview-ActivityIndicator')).toBeTruthy();
    });

    it('should disable the button when loading', () => {
      const props = {
        ...defaultProps,
        isLoading: true
      }

      wrapper.update(<ButtonVoicePreview {...props} />);
      expect(wrapper.getByTestId('ButtonViewPreview-TouchableOpacity').props.disabled).toBe(true);
    });

    it('should render a different button color when playing', () => {
      const props = {
        ...defaultProps,
        isPlaying: true
      }

      wrapper.update(<ButtonVoicePreview {...props} />);
      expect(wrapper.getByTestId('ButtonViewPreview-TouchableOpacity').props.style[1].backgroundColor).toBe(colors.tintColor);
    });

    it('should render a different button color when a voice preview is available', () => {
      const props = {
        ...defaultProps,
        isActive: false,
        isAvailable: true
      }

      wrapper.update(<ButtonVoicePreview {...props} />);
      expect(wrapper.getByTestId('ButtonViewPreview-TouchableOpacity').props.style[2].backgroundColor).toBe(colors.black);
    });

    it('should render a different button color when active', () => {
      const props = {
        ...defaultProps,
        isActive: true
      }

      wrapper.update(<ButtonVoicePreview {...props} />);
      expect(wrapper.getByTestId('ButtonViewPreview-TouchableOpacity').props.style[1].backgroundColor).toBe(colors.tintColor);
    });

    it('should render a different button color when no voice preview is available', () => {
      const props = {
        ...defaultProps,
        isAvailable: false
      }

      wrapper.update(<ButtonVoicePreview {...props} />);
      expect(wrapper.getByTestId('ButtonViewPreview-TouchableOpacity').props.style[0].backgroundColor).toBe(colors.gray);
    });

    it('should render a pause Icon when playing', () => {
      const props = {
        ...defaultProps,
        isPlaying: true
      }

      wrapper.update(<ButtonVoicePreview {...props} />);
      expect(wrapper.getByTestId('ButtonViewPreview-Icon-pause')).toBeTruthy();
    });

    it('should render a pause Icon when playing', () => {
      const props = {
        ...defaultProps,
        isPlaying: true
      }

      wrapper.update(<ButtonVoicePreview {...props} />);
      expect(wrapper.getByTestId('ButtonViewPreview-Icon-pause')).toBeTruthy();
    });
  });
});
