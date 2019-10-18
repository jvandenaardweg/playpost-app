import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';
import { ArticleReader } from '../index';

import articleMock from '../../../../tests/__mocks__/article';
import articleMockRTL from '../../../../tests/__mocks__/article-right-to-left';
import { UserTheme } from '../../../reducers/user';

const defaultProps = {
  article: articleMock
}

describe('ArticleReader', () => {
  let wrapper: RenderAPI;

  describe('rendering default', () => {
    const props = {
      ...defaultProps
    }

    beforeAll(() => {
      wrapper = render(<ArticleReader {...props}></ArticleReader>);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render text from left to right as default', () => {
      const textAlignOccurrences: string[] = wrapper.getByName('WebView').props.source.html.match(/direction: ltr;/g);

      expect(textAlignOccurrences.length).toBeDefined();

      textAlignOccurrences.forEach((textAlign) => {
        expect(textAlign.trim()).toBe('direction: ltr;')
      })
    });
  });

  describe('rendering right to left content', () => {
    const props = {
      ...defaultProps,
      article: articleMockRTL
    }

    beforeAll(() => {
      wrapper = render(<ArticleReader {...props}></ArticleReader>);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render text from right to left', () => {
      const textAlignOccurrences: string[] = wrapper.getByName('WebView').props.source.html.match(/direction: rtl;/g);

      expect(textAlignOccurrences.length).toBeDefined();

      textAlignOccurrences.forEach((textAlign) => {
        expect(textAlign.trim()).toBe('direction: rtl;')
      })
    });
  });

  describe('rendering dark theme', () => {

    beforeAll(() => {
      wrapper = render(<ArticleReader article={articleMock} forceTheme={UserTheme.dark}></ArticleReader>);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });

  describe('rendering no html', () => {

    beforeAll(() => {
      articleMock.html = '';
      wrapper = render(<ArticleReader article={articleMock}></ArticleReader>);
    });

    it('should render a different HTML output when the article has not HTML', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });

  describe('rendering no author name', () => {

    beforeAll(() => {
      articleMock.authorName = '';
      wrapper = render(<ArticleReader article={articleMock}></ArticleReader>);
    });

    it('should render no authorName when it is not present', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });

  describe('rendering no article URL', () => {

    beforeAll(() => {
      articleMock.url = '';
      articleMock.canonicalUrl = '';
      wrapper = render(<ArticleReader article={articleMock}></ArticleReader>);
    });

    it('should render no article URL link', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
