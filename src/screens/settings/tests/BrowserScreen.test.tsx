import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';
import { BrowserScreen } from '../BrowserScreen';

const navigateHandler = jest.fn();
const navigationGetParamHandler = jest.fn();
const navigationGoBackHandler = jest.fn();
const navigationSetParamsHandler = jest.fn();

const props: any = {
  navigation: {
    navigate: navigateHandler,
    getParam: navigationGetParamHandler,
    goBack: navigationGoBackHandler,
    setParams: navigationSetParamsHandler,
  },
};

describe('BrowserScreen', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeAll(() => {
      wrapper = render(<BrowserScreen {...props} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
