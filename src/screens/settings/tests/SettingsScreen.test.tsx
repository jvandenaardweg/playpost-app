import React from 'react';
// tslint:disable-next-line: no-submodule-imports
import * as ShallowRenderer from 'react-test-renderer/shallow';

import { SettingsScreen } from '../SettingsScreen';

describe('SettingsScreen', () => {

  describe('rendering', () => {
    let wrapper: any;

    beforeEach(() => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<SettingsScreen />);
      wrapper = renderer.getRenderOutput();
    });

    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
