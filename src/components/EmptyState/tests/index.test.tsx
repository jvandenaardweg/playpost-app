import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { EmptyState } from '../index';

describe('EmptyState', () => {

  describe('basic rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(
        <EmptyState
          title="Test empty state"
          description={['Test description']}
         />
      );
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render a title', () => {
      expect(wrapper.getByTestId('empty-state-title').props.children).toBe('Test empty state');
    });

    it('should render a description', () => {
      expect(wrapper.getByTestId('empty-state-description').props.children).toBe('Test description');
    });
  });

  describe('full rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(
        <EmptyState
          title="Test empty state"
          description={['Test description']}
          // localVideo={require('../../../assets/video/help/enabling-sharing/enable-sharing-square.m4v')}
          actionButtonLabel="Test button"
          actionButtonOnPress={() => {}}
         />
      );
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render a title', () => {
      expect(wrapper.getByTestId('empty-state-title').props.children).toBe('Test empty state');
    });

    it('should render a description', () => {
      expect(wrapper.getByTestId('empty-state-description').props.children).toBe('Test description');
    });

    // it('should render a video element if given', () => {
    //   // expect(wrapper.getByTestId('empty-state-description')).toBe('Test description');
    // });

    it('should render a button ', () => {
      expect(wrapper.getByTestId('empty-state-button').props.title).toBe('Test button');
    });
  });
});
