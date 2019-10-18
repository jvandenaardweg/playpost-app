import React from 'react';
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

interface State {
  theme: UserTheme
}

type Props = IProps & StateProps;

export class UserThemeProviderContainer extends React.PureComponent<Props, State> {
  state = {
    theme: UserTheme.light // default
  };

  async componentDidMount() {
    const { userSelectedTheme } = this.props;
    this.setState({ theme: userSelectedTheme })

    this.setStatusBarStyle(userSelectedTheme);
  }

  componentDidUpdate(prevProps: Props, nextState: State) {
    const { userSelectedTheme } = this.props;

    // sync store with provider
    if (prevProps.userSelectedTheme !== userSelectedTheme) {
      this.setState({ theme: userSelectedTheme })
      this.setStatusBarStyle(userSelectedTheme);
    }
  }

  setStatusBarStyle = (userSelectedTheme: UserTheme) => {
    if (userSelectedTheme === UserTheme.dark) {
      StatusBar.setBarStyle('light-content')

      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(colors.black)
      }
    } else {
      StatusBar.setBarStyle('dark-content')

      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(colors.white)
      }
    }
  }

  render() {
    return <UserThemeContext.Provider value={this.state}>{this.props.children}</UserThemeContext.Provider>;
  }
}

interface StateProps {
  userSelectedTheme: ReturnType<typeof selectUserSelectedTheme>;
}

const mapStateToProps = (state: RootState): StateProps => ({
  userSelectedTheme: selectUserSelectedTheme(state)
});

const mapDispatchToProps = { };

export const UserThemeProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserThemeProviderContainer);
