import React, { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import { connect } from 'react-redux';

import colors from '../constants/colors';
import { RootState } from '../reducers';
import { UserTheme } from '../reducers/user';
import { selectUserSelectedTheme } from '../selectors/user';

export const UserThemeContext = React.createContext<{ theme: UserTheme; }>({
  theme: UserTheme.light // default
});

export const UserThemeConsumer = UserThemeContext.Consumer;

interface IProps {
  children: React.ReactElement;
}

type Props = IProps & StateProps;

export const UserThemeProviderContainer: React.FC<Props> = React.memo((props) => {

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

  useEffect(() => {
    setStatusBarStyle(props.theme);
  }, [props.theme])

  return <UserThemeContext.Provider value={props}>{props.children}</UserThemeContext.Provider>;
})

interface StateProps {
  theme: ReturnType<typeof selectUserSelectedTheme>;
}

const mapStateToProps = (state: RootState): StateProps => ({
  theme: selectUserSelectedTheme(state)
});

const mapDispatchToProps = { };

export const UserThemeProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserThemeProviderContainer);
