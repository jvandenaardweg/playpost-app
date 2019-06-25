import React from 'react';
import { connect } from 'react-redux';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';

import { postRequestResetPasswordToken } from '../reducers/auth';

import { selectErrorRequestResetPasswordToken } from '../selectors/auth';
import { RootState } from '../reducers';
import { LoginForgotPasswordForm } from '../components/LoginForgotPasswordForm';

/* tslint:disable no-any */
interface State {
  isLoading: boolean;
  isSuccess: boolean | null;
  email: string;
  error: any;
}

interface IProps extends NavigationInjectedProps {}

type Props = IProps & StateProps & DispatchProps;

class LoginForgotPasswordFormContainerComponent extends React.PureComponent<Props, State> {
  state = {
    isLoading: false,
    isSuccess: null,
    email: '',
    error: null
  };

  componentDidMount() {
    this.props.navigation.setParams({ handleOnClose: this.handleOnClose });
  }

  componentDidUpdate(prevProps: Props) {
    // const { authError, token } = this.props;

    // if (authError && prevProps.authError !== authError) {
    //   this.setState({ isLoading: false });
    //   return Alert.alert('Oops!', authError);
    // }
  }

  handleOnClose = () => {
    this.props.navigation.goBack();
  }

  handleOnChangeText = (field: 'email', value: string) => {
    if (field === 'email') this.setState({ email: value });
  }

  handleOnPressResetPasswordCode = () => this.props.navigation.navigate('login/reset-password', { resetPasswordToken: '' });

  handleOnPressResetPassword = () => {
    const { email } = this.state;
    return this.setState({ isLoading: true }, async () => {
      try {
        await this.props.postRequestResetPasswordToken(email);
        this.setState({ isSuccess: true }, () => this.props.navigation.navigate('login/reset-password', { resetPasswordToken: '' }));
      } catch (err) {
        console.log('Error while resetting password', err);
      } finally {
        return this.setState({ isLoading: false });
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