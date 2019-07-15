import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { ArticleEmptyFailed, ArticleEmptyNew, ArticleEmptyProcessing } from '../index';

describe('ArticleEmpty', () => {
  let wrapper: RenderAPI;

  describe('ArticleEmptyProcessing', () => {

    describe('rendering default', () => {

      beforeAll(() => {
        wrapper = render(<ArticleEmptyProcessing isLoading={false} url="https://www.google.nl" />);
      });

      it('should render correctly when isLoading is false', () => {
        expect(wrapper.toJSON()).toMatchSnapshot();
      });
    });

    describe('rendering loading', () => {

      beforeAll(() => {
        wrapper = render(<ArticleEmptyProcessing isLoading={true} url="https://www.google.nl" />);
      });

      it('should render correctly when isLoading is true', () => {
        expect(wrapper.toJSON()).toMatchSnapshot();
      });
    });

  });

  describe('ArticleEmptyFailed', () => {

    describe('rendering default', () => {

      beforeAll(() => {
        wrapper = render(<ArticleEmptyFailed isLoading={false} url="https://www.google.nl" />);
      });

      it('should render correctly', () => {
        expect(wrapper.toJSON()).toMatchSnapshot();
      });
    });

    describe('rendering loading', () => {

      beforeAll(() => {
        wrapper = render(<ArticleEmptyFailed isLoading={true} url="https://www.google.nl" />);
      });

      it('should render correctly when isLoading is true', () => {
        expect(wrapper.toJSON()).toMatchSnapshot();
      });
    });

  });

  describe('ArticleEmptyNew', () => {

    describe('rendering default', () => {

      beforeAll(() => {
        wrapper = render(<ArticleEmptyNew isLoading={false} url="https://www.google.nl" />);
      });

      it('should render correctly', () => {
        expect(wrapper.toJSON()).toMatchSnapshot();
      });
    });

    describe('rendering loading', () => {

      beforeAll(() => {
        wrapper = render(<ArticleEmptyNew isLoading={true} url="https://www.google.nl" />);
      });

      it('should render correctly when isLoading is true', () => {
        expect(wrapper.toJSON()).toMatchSnapshot();
      });
    });

  });

});
