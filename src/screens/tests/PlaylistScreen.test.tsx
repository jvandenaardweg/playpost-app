import React from 'react';
// tslint:disable-next-line: no-submodule-imports
import * as ShallowRenderer from 'react-test-renderer/shallow';

import { PlaylistScreen } from '../PlaylistScreen';

describe('PlaylistScreen', () => {

  describe('rendering', () => {
    let wrapper: any;

    beforeEach(() => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<PlaylistScreen />);
      wrapper = renderer.getRenderOutput();
    });

    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
