import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { ListItemVoice } from '../index';

import voicesMock from '../../../../tests/__mocks__/voices';

describe('ListItemVoice', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(
        <ListItemVoice
          voice={voicesMock[0]}
          isSelected={false}
          isLoadingSaveSelected={false}
          isPlaying={false}
          isActive={false}
          isAvailable={false}
          isLoadingVoicePreview={false}
          onPressPreview={() => {}}
          onPressSelect={() => {}}
        />
      );
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
