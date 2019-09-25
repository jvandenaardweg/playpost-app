import React from 'react';
import { Text as RNText } from 'react-native';
import { render, RenderAPI } from 'react-native-testing-library';
import { AppBackground } from '../index';

import Text from '../../Text';

describe('AppBackground', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<AppBackground><Text>Example!</Text></AppBackground>);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render a child element', () => {
      expect(wrapper.getByType(RNText).props.children).toBe('Example!');
    });
  });
});
