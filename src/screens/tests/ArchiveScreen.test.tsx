import React from 'react';
// tslint:disable-next-line: no-submodule-imports
import * as ShallowRenderer from 'react-test-renderer/shallow';

import { ArchiveScreen } from '../ArchiveScreen';

describe('ArchiveScreen', () => {

  describe('rendering', () => {
    let wrapper: any;

    beforeEach(() => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<ArchiveScreen />);
      wrapper = renderer.getRenderOutput();
    });

    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
