import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { ButtonReload } from '../index';

describe('ButtonReload', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;
    const onPressHandler = jest.fn();

    beforeAll(() => {
      wrapper = render(<ButtonReload onPress={onPressHandler} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
