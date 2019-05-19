import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { ArticleEmptyProcessing, ArticleEmptyFailed } from '../ArticleEmpty';

describe('ArticleEmpty', () => {

  describe('ArticleEmptyProcessing', () => {

    describe('rendering processing', () => {
      let wrapper: RenderAPI;

      beforeAll(() => {
        wrapper = render(<ArticleEmptyProcessing isLoading={false} url="https://www.google.nl" />);
      });

      it('should render correctly', () => {
        expect(wrapper.toJSON()).toMatchSnapshot();
      });
    });

  });

  describe('ArticleEmptyFailed', () => {

    describe('rendering processing', () => {
      let wrapper: RenderAPI;

      beforeAll(() => {
        wrapper = render(<ArticleEmptyFailed isLoading={false} url="https://www.google.nl" />);
      });

      it('should render correctly', () => {
        expect(wrapper.toJSON()).toMatchSnapshot();
      });
    });

  });

});
