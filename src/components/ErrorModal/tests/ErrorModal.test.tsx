import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { ErrorModal } from '../ErrorModal';

describe('ErrorModal', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;
    const onPressCloseHandler = jest.fn();

    beforeAll(() => {
      wrapper = render(<ErrorModal message="Test" onPressClose={onPressCloseHandler} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
