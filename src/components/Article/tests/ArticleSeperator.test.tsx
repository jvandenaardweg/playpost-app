import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';
import { ArticleSeperator } from '../ArticleSeperator';

describe('ArticleSeperator', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<ArticleSeperator />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
