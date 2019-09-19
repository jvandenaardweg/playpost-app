import React from 'react';
import * as ReactNative from 'react-native';
import { render, RenderAPI } from 'react-native-testing-library';
import { fontFamilies, textTemplates } from '../index';

import { Text } from '../../Text';

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
      expect(wrapper.getByType(ReactNative.Text).props.children).toBe('Example!');
    });

    it('should render the correct default fontFamily', () => {
      expect(wrapper.getByType(ReactNative.Text).props.style[0]).toMatchObject(fontFamilies['regular']);
    });

    Object.keys(fontFamilies).forEach(fontWeightKey => {
      it(`should render the correct font-weight: ${fontWeightKey}`, () => {
        wrapper.update(<Text fontWeight={fontWeightKey as any}>Example!</Text>);
        expect(wrapper.getByType(ReactNative.Text).props.style[0]).toMatchObject(fontFamilies[fontWeightKey]);
      });
    });

    Object.keys(textTemplates).forEach(templateKey => {
      it(`should render the correct ${templateKey}`, () => {
        wrapper.update(<Text template={templateKey as any}>Example!</Text>);
        expect(wrapper.getByType(ReactNative.Text).props.style[0]).toMatchObject(textTemplates[templateKey]);
      });
    });

  });
});
