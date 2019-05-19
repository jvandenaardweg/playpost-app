import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { ErrorModal } from '../ErrorModal';

describe('ErrorModal', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<ErrorModal onPressAction={() => {}} message="Test" action="Test" />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
