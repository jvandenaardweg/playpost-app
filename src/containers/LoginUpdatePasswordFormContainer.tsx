import React from 'react';
import { connect } from 'react-redux';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';

import { postUpdatePassword } from '../reducers/auth';

import { selectErrorResetPassword } from '../selectors/auth';
import { RootState } from '../reducers';
import { LoginUpdatePasswordForm } from '../components/LoginUpdatePasswordForm';

/* tslint:disable no-any */
interface State {
  isLoading: boolean;
  isSuccess: boolean | null;
  password: string;
  resetPasswordToken: string;
  error: any;
}

interface IProps extends NavigationInjectedProps {}

type Props = IProps & StateProps & DispatchProps;

class LoginUpdatePasswordFormContainerComponent extends React.PureComponent<Props, State> {
  state = {
    isLoading: false,
    isSuccess: null,
    password: '',
    resetPasswordToken: '',
    error: null
  };

  componentDidMount() {
    this.props.navigation.setParams({ handleOnClose: this.handleOnClose });

    const resetPasswordToken = this.props.navigation.getParam('resetPasswordToken', '');

    this.setState({ resetPasswordToken });
  }

  componentDidUpdate(prevProps: Props) {
    const { isSuccess } = this.state;

    if (isSuccess) {
      // TODO: login user
    }
    // const { authError, token } = this.props;

    // if (authError && prevProps.authError !== authError) {
    //   this.setState({ isLoading: false });
    //   return Alert.alert('Oops!', authError);
    // }
  }

  handleOnClose = () => {
    this.props.navigation.goBack();
  }

  handleOnChangeText = (field: 'password' | 'resetPasswordToken', value: string) => {
    if (field === 'password') this.setState({ password: value });
    if (field === 'resetPasswordToken') this.setState({ resetPasswordToken: value });
  }

  handleOnPressUpdatePassword = () => {
    const { password, resetPasswordToken } = this.state;
    console.log('Update ', password, resetPasswordToken);

    return this.setState({ isLoading: true }, async () => {
      try {
        await this.props.postUpdatePassword(password, resetPasswordToken);
        this.setState({ isSuccess: true });
      } catch (err) {
        console.log('Err', err);
      } finally {
        this.setState({ isLoading: false });
      }
    });
  }

  render() {
    const { password, isLoading, isSuccess, resetPasswordToken } = this.state;

    return (
      <LoginUpdatePasswordForm
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
  errorResetPassword: ReturnType<typeof selectErrorResetPassword>;
}

interface DispatchProps {
  postUpdatePassword: typeof postUpdatePassword;
}

const mapStateToProps = (state: RootState) => ({
  errorResetPassword: selectErrorResetPassword(state)
});

const mapDispatchToProps = {
  postUpdatePassword
};

export const LoginUpdatePasswordFormContainer = withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoginUpdatePasswordFormContainerComponent)
);
