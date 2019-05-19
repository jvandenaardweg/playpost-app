import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { OfflineNotice } from '../OfflineNotice';

describe('OfflineNotice', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<OfflineNotice />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
