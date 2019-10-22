import React, { useEffect, useState, ReactNode } from 'react';
import { Platform, StatusBar } from 'react-native';
import { eventEmitter, useDarkMode } from 'react-native-dark-mode'
// tslint:disable-next-line: no-submodule-imports
import { Mode } from 'react-native-dark-mode/dist/types';
import { connect } from 'react-redux';

import colors from '../constants/colors';
import { RootState } from '../reducers';
import { setUserSelectedTheme, userDefaultTheme, UserTheme } from '../reducers/user';
import { selectUserSelectedTheme } from '../selectors/user';

export const UserThemeContext = React.createContext<{ theme: UserTheme; }>({
  theme: userDefaultTheme // The default theme for new users is Light
});

export const UserThemeConsumer = UserThemeContext.Consumer;

interface IProps {
  children?: ReactNode;
}

export type Props = IProps & StateProps & DispatchProps;

export const UserThemeProviderComponent: React.FC<Props> = React.memo((props) => {
  const [localTheme, setLocalTheme] = useState(userDefaultTheme) // Default theme of the app is light
  const isDarkMode = useDarkMode();

  const handleModeChange = (newMode: Mode) => {
    // If the user's theme settings is set to auto, listen for mode changes and apply those changes
    // These changes happen when the user's OS switches from light to dark, and the other way around
    if (props.userSelectedTheme === UserTheme.auto) {
      switchTheme(newMode === 'dark' ? UserTheme.dark : UserTheme.light)
    }
  }

  const switchTheme = (theme: UserTheme) => {
    setStatusBarStyle(theme)

    // Use a local state so we can handle auto-theming based on the phone's OS theme
    return setLocalTheme(theme)
  }

  const setStatusBarStyle = (theme: UserTheme) => {
    if (theme === UserTheme.dark) {
      StatusBar.setBarStyle('light-content')

      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(colors.pureBlack)
      }
    } else {
      StatusBar.setBarStyle('dark-content')

      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(colors.white)
      }
    }
  }

  // mount
  useEffect(() => {
    eventEmitter.on('currentModeChanged', handleModeChange)

    // unmount
    return () => {
      eventEmitter.off('currentModeChanged', handleModeChange)
    }
  }, [])

  useEffect(() => {
    // Upon app start, determine which theme to use
    if (props.userSelectedTheme === UserTheme.auto) {
      switchTheme(isDarkMode ? UserTheme.dark : UserTheme.light)
    } else {
      switchTheme(props.userSelectedTheme)
    }
  }, [props.userSelectedTheme, isDarkMode])

  return <UserThemeContext.Provider value={{ theme: localTheme }}>{props.children}</UserThemeContext.Provider>;
})

interface StateProps {
  userSelectedTheme: ReturnType<typeof selectUserSelectedTheme>;
}

interface DispatchProps {
  setUserSelectedTheme: typeof setUserSelectedTheme;
}

const mapStateToProps = (state: RootState): StateProps => ({
  userSelectedTheme: selectUserSelectedTheme(state)
});

const mapDispatchToProps = {
  setUserSelectedTheme
};

export const UserThemeProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserThemeProviderComponent);
