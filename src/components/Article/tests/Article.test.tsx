import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';
import { Article } from '../Article';

describe('Article', () => {

  describe('minimal rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(
        <Article
          onOpenUrl={() => {}}
          onPlayPress={() => {}}
          url="https://www.google.nl"
        />
      );
    });

    it('should render minimal correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render a play icon', () => {
      expect(wrapper.getByTestId('article-icon-play')).toBeTruthy();
    });

    it('should render a duration', () => {
      expect(wrapper.getByTestId('article-duration')).toBeTruthy();
    });

    it('should render default color download icon', () => {
      expect(wrapper.getByTestId('article-icon-downloaded').props.color).toBe('#cccccc');
    });
  });

  describe('loading rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(
        <Article
          onOpenUrl={() => {}}
          onPlayPress={() => {}}
          url="https://www.google.nl"
          isLoading
        />);
    });

    it('should render loading correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render a activity indicator', () => {
      expect(wrapper.getByTestId('article-activity-indicator')).toBeTruthy();
    });
  });

  describe('active rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(
        <Article
          onOpenUrl={() => {}}
          onPlayPress={() => {}}
          url="https://www.google.nl"
          isActive
        />);
    });

    it('should render active correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render a different color play button', () => {
      expect(wrapper.getByTestId('article-play-button').props.style[1].backgroundColor).toBe('#037DE2');
    });
  });

  describe('playing rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(
        <Article
          onOpenUrl={() => {}}
          onPlayPress={() => {}}
          url="https://www.google.nl"
          isPlaying
          isActive
        />);
    });

    it('should render playing correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render a pause icon', () => {
      expect(wrapper.getByTestId('article-icon-pause')).toBeTruthy();
    });
  });

  describe('downloaded rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(
        <Article
          onOpenUrl={() => {}}
          onPlayPress={() => {}}
          url="https://www.google.nl"
          isDownloaded
        />);
    });

    it('should render downloaded correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render different color download icon', () => {
      expect(wrapper.getByTestId('article-icon-downloaded').props.color).toBe('#03A87C');
    });
  });

  describe('full rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(
        <Article
          onOpenUrl={() => {}}
          onPlayPress={() => {}}
          url="https://www.google.nl"
          title="Test title"
          description="Test description"
          sourceName="Test"
          authorName="Jordy"
          listenTimeInSeconds={120}
          readingTime={140}
        />);
    });

    it('should render full correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render a title', () => {
      expect(wrapper.getByTestId('article-title').props.children).toBe('Test title');
    });

    it('should render a description', () => {
      expect(wrapper.getByTestId('article-description').props.children).toBe('Test description');
    });

    it('should render a source name', () => {
      expect(wrapper.getByTestId('article-source-name').props.children[0]).toBe('Jordy on ');
      expect(wrapper.getByTestId('article-source-name').props.children[1]).toBe('Test');
    });

    it('should render a duration', () => {
      expect(wrapper.getByTestId('article-duration').props.children).toBe('2 min');
    });

    it('should render a play button with a play icon', () => {
      expect(wrapper.getByTestId('article-play-button')).toBeTruthy();
      expect(wrapper.getByTestId('article-icon-play')).toBeTruthy();
    });
  });
});