import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { ListItemLanguage } from '../index';

import languagesMock from '../../../../tests/__mocks__/languages';

describe('ListItemLanguage', () => {
  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<ListItemLanguage language={languagesMock[0]} subtitle="A Subtitle" totalVoices={languagesMock[0].voices.length} onPress={() => {}} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
