import React from 'react';
import { StatusBar } from 'react-native';
import { render, RenderAPI } from 'react-native-testing-library';
import { UserTheme } from '../../reducers/user';
import { Props, UserThemeConsumer, UserThemeProviderComponent } from '../UserThemeProvider';

const setUserSelectedThemeHandler = jest.fn();

const defaultProps: Props = {
  userSelectedTheme: UserTheme.light,
  setUserSelectedTheme: setUserSelectedThemeHandler
}
describe('UserThemeProvider', () => {

  describe('rendering', () => {
    let wrapper: RenderAPI;

    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    beforeAll(() => {
      const props = {
        ...defaultProps
      }

      wrapper = render(<UserThemeProviderComponent {...props} />);
    });

    it('should render correctly', () => {
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('should provide the correct default theme', () => {
      const props = {
        ...defaultProps
      }

      const spySetBarStyle = jest.spyOn(StatusBar, 'setBarStyle');

      wrapper = render(
        <UserThemeProviderComponent {...props}>
          <UserThemeConsumer>{context => context.theme}</UserThemeConsumer>
        </UserThemeProviderComponent>
      );

      expect(wrapper.toJSON()).toBe('light');

      expect(spySetBarStyle).toHaveBeenCalledTimes(1);
      expect(spySetBarStyle).toHaveBeenCalledWith('dark-content');
    });

    it('should provide the correct theme when changed', () => {
      const props = {
        ...defaultProps,
        userSelectedTheme: UserTheme.dark
      }

      const spySetBarStyle = jest.spyOn(StatusBar, 'setBarStyle');

      wrapper = render(
        <UserThemeProviderComponent {...props}>
          <UserThemeConsumer>{context => context.theme}</UserThemeConsumer>
        </UserThemeProviderComponent>
      );

      expect(wrapper.toJSON()).toBe('dark');
      expect(spySetBarStyle).toHaveBeenCalledTimes(1);
      expect(spySetBarStyle).toHaveBeenCalledWith('light-content');
    });

    it('should provide the correct theme when the theme is set on auto', () => {
      const props = {
        ...defaultProps,
        userSelectedTheme: UserTheme.auto
      }

      const spySetBarStyle = jest.spyOn(StatusBar, 'setBarStyle');

      wrapper = render(
        <UserThemeProviderComponent {...props}>
          <UserThemeConsumer>{context => context.theme}</UserThemeConsumer>
        </UserThemeProviderComponent>
      );

      // "light" is the default theme in the testing environment
      expect(wrapper.toJSON()).toBe('light');

      expect(spySetBarStyle).toHaveBeenCalledTimes(1);
      expect(spySetBarStyle).toHaveBeenCalledWith('dark-content');
    });
  });
});
