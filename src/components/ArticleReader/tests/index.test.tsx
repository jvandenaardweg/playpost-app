import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';
import { ArticleReader } from '../index';

import articleMock from '../../../../tests/__mocks__/article';

describe('ArticleReader', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<ArticleReader article={articleMock}></ArticleReader>);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
