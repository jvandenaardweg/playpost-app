import React from 'react';
import { Text as RNText } from 'react-native';
import { render, RenderAPI } from 'react-native-testing-library';
import { fontFamilies, textPresets } from '../index';

import Text from '../../Text';

describe('Text', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<Text>Example!</Text>);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should render a child element', () => {
      expect(wrapper.getByType(RNText).props.children).toBe('Example!');
    });

    it('should render the correct default fontFamily', () => {
      expect(wrapper.getByType(RNText).props.style[0]).toMatchObject(fontFamilies['regular']);
    });

    Object.keys(fontFamilies).forEach(fontWeightKey => {
      it(`should render the correct font-weight: ${fontWeightKey}`, () => {
        wrapper.update(<Text fontWeight={fontWeightKey as any}>Example!</Text>);
        expect(wrapper.getByType(RNText).props.style[0]).toMatchObject(fontFamilies[fontWeightKey]);
      });
    });

    Object.keys(textPresets).forEach(presetKey => {
      it(`should render the correct ${presetKey}`, () => {
        wrapper.update(<Text preset={presetKey as any}>Example!</Text>);
        expect(wrapper.getByType(RNText).props.style[0]).toMatchObject(textPresets[presetKey]);
      });
    });

  });
});
