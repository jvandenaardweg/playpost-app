import React from 'react';
// tslint:disable-next-line: no-submodule-imports
import * as ShallowRenderer from 'react-test-renderer/shallow';

import { SettingsLanguagesScreen } from '../LanguagesScreen';

describe('SettingsLanguagesScreen', () => {

  describe('rendering', () => {
    let wrapper: any;

    beforeEach(() => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<SettingsLanguagesScreen />);
      wrapper = renderer.getRenderOutput();
    });

    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
