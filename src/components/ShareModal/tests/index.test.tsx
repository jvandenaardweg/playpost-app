import React from 'react';
import { render, RenderAPI } from 'react-native-testing-library';

import { ShareModal } from '../index';

describe('ShareModal', () => {
  let wrapper: RenderAPI;
  const onPressCloseHandler = jest.fn();
  const errorMessage = 'Test error message';
  const successMessage = 'Article is added to your playlist!';

  describe('rendering', () => {
    beforeAll(() => {
      wrapper = render(<ShareModal isLoading={false} isSuccess={false} isError={false} errorMessage={''} onPressClose={onPressCloseHandler} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should show an error message when errorMessage and isError is set', () => {
      wrapper.update(<ShareModal isLoading={false} isSuccess={false} isError={true} errorMessage={errorMessage} onPressClose={onPressCloseHandler} />);
      expect(wrapper.queryByText(errorMessage)).toBeTruthy();
    });

    it('should not show an error message when isLoading is set', () => {
      wrapper.update(<ShareModal isLoading={true} isSuccess={false} isError={true} errorMessage={errorMessage} onPressClose={onPressCloseHandler} />);
      expect(wrapper.queryByText(errorMessage)).toBeFalsy();
    });

    it('should not show an success message when isLoading is set', () => {
      wrapper.update(<ShareModal isLoading={true} isSuccess={false} isError={false} errorMessage={errorMessage} onPressClose={onPressCloseHandler} />);
      expect(wrapper.queryByText(successMessage)).toBeFalsy();
    });

    it('should show an success message when isSuccess is set', () => {
      wrapper.update(<ShareModal isLoading={false} isSuccess={true} isError={false} errorMessage={''} onPressClose={onPressCloseHandler} />);
      expect(wrapper.queryByText(successMessage)).toBeTruthy();
    });

  });

  describe('interacting', () => {
    beforeAll(() => {
      wrapper = render(<ShareModal isLoading={false} isSuccess={false} isError={false} errorMessage={''} onPressClose={onPressCloseHandler} />);
    });

    it('should fire onPressClose when pressing the close button', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});
