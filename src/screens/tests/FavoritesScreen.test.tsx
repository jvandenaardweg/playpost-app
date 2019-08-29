import React from 'react';
// tslint:disable-next-line: no-submodule-imports
import * as ShallowRenderer from 'react-test-renderer/shallow';

import { FavoritesScreen } from '../FavoritesScreen';

describe('FavoritesScreen', () => {

  describe('rendering', () => {
    let wrapper: any;

    beforeEach(() => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<FavoritesScreen />);
      wrapper = renderer.getRenderOutput();
    });

    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
