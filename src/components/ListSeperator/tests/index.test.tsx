import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';
import { ListSeperator } from '../index';

describe('ListSeperator', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<ListSeperator />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
