import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';
import { ArticleView } from '../ArticleView';

import articleMock from '../../../../tests/__mocks__/article';

describe('ArticleView', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<ArticleView article={articleMock}></ArticleView>);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
