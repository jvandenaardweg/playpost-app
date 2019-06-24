import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';
import { ArticleReader } from '../index';

import articleMock from '../../../../tests/__mocks__/article';

describe('ArticleReader', () => {
  let wrapper: RenderAPI;

  describe('rendering default', () => {

    beforeAll(() => {
      wrapper = render(<ArticleReader article={articleMock}></ArticleReader>);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });

  describe('rendering dark theme', () => {

    beforeAll(() => {
      wrapper = render(<ArticleReader article={articleMock} theme="dark"></ArticleReader>);
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
