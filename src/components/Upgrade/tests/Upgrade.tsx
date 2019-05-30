import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { Upgrade } from '../Upgrade';

describe('Upgrade', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<Upgrade onClose={() => {}} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
