import React from 'react';
import { fireEvent, render, RenderAPI } from 'react-native-testing-library';
import colors from '../../../constants/colors';
import { TextDirection } from '../../../typings';
import { Article } from '../index';

describe('Article', () => {
  let wrapper: RenderAPI;
  const onOpenUrlHandler = jest.fn();
  const onPlayPressHandler = jest.fn();
  const onLongPressHandler = jest.fn();
  const onPressOutHandler = jest.fn();
  const onPressArticleIncompatibleHandler = jest.fn();

  const defaultProps = {
    onOpenUrl: onOpenUrlHandler,
    onPlayPress: onPlayPressHandler,
    onLongPress: onLongPressHandler,
    onPressOut: onPressOutHandler,
    onPressArticleIncompatible: onPressArticleIncompatibleHandler,
    url: "https://www.google.nl",
    playlistItemCreatedAt: new Date().toISOString(),
    isCompatible: true,
    textDirection: 'ltr' as TextDirection
  }

  describe('minimal rendering', () => {
    beforeAll(() => {
      const props = {
        ...defaultProps
      }

      wrapper = render(<Article {...props} />);
    });

    it('should render minimal correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render a play icon', () => {
      expect(wrapper.getByTestId('Article-PlayIcon-Icon-play')).toBeTruthy();
    });

    it('should render a duration', () => {
      expect(wrapper.getByTestId('Article-duration')).toBeTruthy();
    });

    it('should render default color download icon', () => {
      expect(wrapper.getByTestId('Article-icon-downloaded').props.color).toBe(colors.gray);
    });
  });

  describe('loading rendering', () => {
    beforeAll(() => {
      const props = {
        ...defaultProps,
        isLoading: true
      }

      wrapper = render(<Article {...props} />);
    });

    it('should render loading correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render a activity indicator', () => {
      expect(wrapper.getByTestId('Article-PlayIcon-ActivityIndicator')).toBeTruthy();
    });
  });

  describe('active rendering', () => {
    beforeAll(() => {
      const props = {
        ...defaultProps,
        isActive: true
      }

      wrapper = render(<Article {...props} />);
    });

    it('should render active correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render a different color play button', () => {
      expect(wrapper.getByTestId('Article-PlayIcon-view').props.style[1].backgroundColor).toBe(colors.tintColor);
    });
  });

  describe('playing rendering', () => {
    beforeAll(() => {
      const props = {
        ...defaultProps,
        isPlaying: true,
        isActive: true
      }

      wrapper = render(<Article {...props} />);
    });

    it('should render playing correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render a pause icon', () => {
      expect(wrapper.getByTestId('Article-PlayIcon-Icon-pause')).toBeTruthy();
    });
  });

  describe('downloaded rendering', () => {
    beforeAll(() => {
      const props = {
        ...defaultProps,
        isDownloaded: true
      }

      wrapper = render(<Article {...props} />);
    });

    it('should render downloaded correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render different color download icon', () => {
      expect(wrapper.getByTestId('Article-icon-downloaded').props.color).toBe(colors.green);
    });
  });

  describe('full rendering', () => {
    beforeAll(() => {
      const props = {
        ...defaultProps,
        title: 'Test title',
        description: 'Test description',
        sourceName: 'Test',
        authorName: 'Jordy',
        listenTimeInSeconds: 120,
        readingTime: 140
      }

      wrapper = render(<Article {...props} />);
    });

    it('should render full correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render a title', () => {
      expect(wrapper.getByTestId('Article-title').props.children).toBe('Test title');
    });

    it('should render the title from left to right', () => {
      expect(wrapper.getByTestId('Article-title').props.style[1].writingDirection).toBe('ltr');
    });

    it('should render a source name', () => {
      expect(wrapper.getByTestId('Article-source-name').props.children).toBe('Jordy on Test');
    });

    it('should render a duration', () => {
      expect(wrapper.getByTestId('Article-duration').props.children).toBe('2 min.');
    });

    it('should render a play button with a play icon', () => {
      expect(wrapper.queryByTestId('Article-PlayIcon-view')).toBeTruthy();
      expect(wrapper.queryByTestId('Article-PlayIcon-Icon-play')).toBeTruthy();
    });

    it('should not render a compatibility warning message', () => {
      expect(wrapper.queryByTestId('Article-Button-incompatibility-warning')).toBeFalsy();
    });

    it('should fire onOpenUrl when pressing on the article', () => {
      fireEvent.press(wrapper.getByTestId('Article-Button-section'));
      expect(onOpenUrlHandler).toHaveBeenCalledTimes(1);
    });

    it('should fire onPlayPress when pressing on the play button', () => {
      fireEvent.press(wrapper.getByTestId('Article-Button-play'));
      expect(onPlayPressHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('incompatibility warning render', () => {
    beforeAll(() => {
      const props = {
        ...defaultProps,
        isCompatible: false
      }

      wrapper = render(<Article {...props} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render a compatibility warning message', () => {
      expect(wrapper.queryByTestId('Article-Button-incompatibility-warning')).toBeTruthy();
    });

    it('should fire onPressArticleIncompatible when pressing on the warning', () => {
      fireEvent.press(wrapper.getByTestId('Article-Button-incompatibility-warning'));
      expect(onPressArticleIncompatibleHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('right to left text', () => {
    beforeAll(() => {
      const props = {
        ...defaultProps,
        textDirection: 'rtl' as TextDirection
      }

      wrapper = render(<Article {...props} />);
    });

    it('should render the title from right to left', () => {
      expect(wrapper.getByTestId('Article-title').props.style[1].writingDirection).toBe('rtl');
    });
  });
});
