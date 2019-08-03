import React from 'react';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

import { postRequestResetPasswordToken } from '../reducers/auth';

import { LoginForgotPasswordForm } from '../components/LoginForgotPasswordForm';
import { RootState } from '../reducers';
import { selectErrorRequestResetPasswordToken } from '../selectors/auth';

/* tslint:disable no-any */
interface State {
  isLoading: boolean;
  isSuccess: boolean | null;
  email: string;
  error: any;
}

type Props = NavigationInjectedProps & StateProps & DispatchProps;

class LoginForgotPasswordFormContainerComponent extends React.PureComponent<Props, State> {
  state = {
    isLoading: false,
    isSuccess: null,
    email: '',
    error: null
  };

  componentDidMount(): void {
    this.props.navigation.setParams({ handleOnClose: this.handleOnClose });
  }

  handleOnClose = () => {
    this.props.navigation.goBack();
  }

  handleOnChangeText = (field: 'email', value: string) => {
    if (field === 'email') { this.setState({ email: value }); }
  }

  handleOnPressResetPasswordCode = () => this.props.navigation.navigate('login/reset-password', { resetPasswordToken: '' });

  handleOnPressResetPassword = () => {
    const { email } = this.state;
    return this.setState({ isLoading: true }, async () => {
      try {
        await this.props.postRequestResetPasswordToken(email);
        this.setState({ isSuccess: true }, () => this.props.navigation.navigate('login/reset-password', { resetPasswordToken: '' }));
      } catch (err) {
        return err;
      } finally {
        this.setState({ isLoading: false });
      }
    });
  }

  render() {
    const { email, isLoading, isSuccess } = this.state;

    return (
      <LoginForgotPasswordForm
        email={email}
        isLoading={isLoading}
        isSuccess={isSuccess}
        onChangeText={this.handleOnChangeText}
        onPressResetPassword={this.handleOnPressResetPassword}
        onPressResetPasswordCode={this.handleOnPressResetPasswordCode}
      />
    );
  }
}

interface StateProps {
  errorResetPassword: ReturnType<typeof selectErrorRequestResetPasswordToken>;
}

interface DispatchProps {
  postRequestResetPasswordToken: typeof postRequestResetPasswordToken;
}

const mapStateToProps = (state: RootState) => ({
  errorResetPassword: selectErrorRequestResetPasswordToken(state)
});

const mapDispatchToProps = {
  postRequestResetPasswordToken
};

export const LoginForgotPasswordFormContainer = withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoginForgotPasswordFormContainerComponent)
);
