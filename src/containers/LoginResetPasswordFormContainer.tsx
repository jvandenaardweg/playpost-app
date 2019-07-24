import React from 'react';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

import { postUpdatePassword } from '../reducers/auth';

import { LoginResetPasswordForm } from '../components/LoginResetPasswordForm';
import { RootState } from '../reducers';
import { selectErrorRequestResetPasswordToken } from '../selectors/auth';

/* tslint:disable no-any */
interface State {
  isLoading: boolean;
  isSuccess: boolean | null;
  password: string;
  resetPasswordToken: string;
  error: any;
}

type Props = NavigationInjectedProps & StateProps & DispatchProps;

class LoginResetPasswordFormContainerComponent extends React.PureComponent<Props, State> {
  state = {
    isLoading: false,
    isSuccess: null,
    password: '',
    resetPasswordToken: '',
    error: null
  };

  timeout: NodeJS.Timeout | null = null;

  componentDidMount() {
    this.props.navigation.setParams({ handleOnClose: this.handleOnClose });

    this.setResetPasswordTokenFromNavigationParams();
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetPasswordToken } = this.state;

    if (!resetPasswordToken) { this.setResetPasswordTokenFromNavigationParams(); }
  }

  setResetPasswordTokenFromNavigationParams = () => {
    const resetPasswordToken = this.props.navigation.getParam('resetPasswordToken', '');
    this.setState({ resetPasswordToken });
  }

  handleOnClose = () => {
    this.props.navigation.goBack();
  }

  handleOnChangeText = (field: 'password' | 'resetPasswordToken', value: string) => {
    if (field === 'password') { this.setState({ password: value }); }
    if (field === 'resetPasswordToken') { this.setState({ resetPasswordToken: value }); }
  }

  handleOnPressUpdatePassword = () => {
    const { password, resetPasswordToken } = this.state;

    return this.setState({ isLoading: true }, async () => {
      try {
        await this.props.postUpdatePassword(password, resetPasswordToken);
        this.setState({ isSuccess: true });

        // Redirect the user to the login screen
        this.timeout = setTimeout(() => {
          this.props.navigation.navigate('login');
        }, 2000);

      } catch (err) {
        return err;
      } finally {
        this.setState({ isLoading: false });
      }
    });
  }

  render(): JSX.Element {
    const { password, isLoading, isSuccess, resetPasswordToken } = this.state;

    return (
      <LoginResetPasswordForm
        password={password}
        resetPasswordToken={resetPasswordToken}
        isLoading={isLoading}
        isSuccess={isSuccess}
        onChangeText={this.handleOnChangeText}
        onPressUpdatePassword={this.handleOnPressUpdatePassword}
      />
    );
  }
}

interface StateProps {
  errorResetPassword: ReturnType<typeof selectErrorRequestResetPasswordToken>;
}

interface DispatchProps {
  postUpdatePassword: typeof postUpdatePassword;
}

const mapStateToProps = (state: RootState) => ({
  errorResetPassword: selectErrorRequestResetPasswordToken(state)
});

const mapDispatchToProps = {
  postUpdatePassword
};

export const LoginResetPasswordFormContainer = withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoginResetPasswordFormContainerComponent)
);
