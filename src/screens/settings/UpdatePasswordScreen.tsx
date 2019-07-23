import React from 'react';
import { Alert } from 'react-native';
import { NavigationInjectedProps, NavigationRoute, NavigationScreenProp, NavigationStackScreenOptions } from 'react-navigation';
import { connect } from 'react-redux';

import { ALERT_GENERIC_INTERNET_REQUIRED } from '../../constants/messages';

import { UpdatePasswordForm } from '../../components/UpdatePasswordForm';

import { RootState } from '../../reducers';
import { updateUserPassword } from '../../reducers/user';

import { selectUserError } from '../../selectors/user';

import { NetworkContext } from '../../contexts/NetworkProvider';

interface State {
  isLoading: boolean;
  isSuccess: boolean;
  password: string;
  passwordValidation: string;
  validationError: string;
}

interface StateProps {
  userError: string;
}

type Props = NavigationInjectedProps & StateProps & DispatchProps;

export class UpdatePasswordScreenContainer extends React.PureComponent<Props, State> {

  public static contextType = NetworkContext;
  public static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: 'Change password'
    };
  }

  public state = {
    isLoading: false,
    isSuccess: false,
    password: '',
    passwordValidation: '',
    validationError: '',
  };

  public navigationTimeout: NodeJS.Timeout | null = null;

  public componentDidUpdate(prevProps: Props) {
    const { userError } = this.props;

    if (userError && prevProps.userError !== userError) {
      return Alert.alert('Oops!', userError);
    }
  }

  public componentWillUnmount() {
    if (this.navigationTimeout) {
      clearTimeout(this.navigationTimeout);
    }
  }

  public handleOnPressUpdatePassword = async () => {
    const { password, passwordValidation, isSuccess } = this.state;
    const { isConnected } = this.context;

    if (!isConnected) { return Alert.alert('Oops!', ALERT_GENERIC_INTERNET_REQUIRED); }

    // Just navigate back to the settings screen
    if (isSuccess) { return this.props.navigation.navigate('Settings'); }

    if (password !== passwordValidation) {
      return Alert.alert('Oops!', 'The given passwords do not match. Please make sure you typed your passwords correctly.');
    }

    this.setState({ isLoading: true }, async () => {
      try {
        await this.props.updateUserPassword(password);
        return this.setState({ isSuccess: true, isLoading: false }, () => {
          this.navigationTimeout = setTimeout(() => this.props.navigation.navigate('Settings'), 2000);
        });
      } catch (err) {
        this.setState({ isSuccess: false, isLoading: false });
        // For errors, rely on the Redux state error we get through props
        return err;
      }
    });
  }

  public handleOnChangeText = (field: 'password' | 'passwordValidation', value: string) => {
    if (field === 'password') { this.setState({ password: value }); }
    if (field === 'passwordValidation') { this.setState({ passwordValidation: value }); }
  }

  public render(): JSX.Element {
    const { password, passwordValidation, isLoading, isSuccess } = this.state;

    return (
      <UpdatePasswordForm
        password={password}
        passwordValidation={passwordValidation}
        isLoading={isLoading}
        isSuccess={isSuccess}
        onChangeText={this.handleOnChangeText}
        onPressUpdatePassword={this.handleOnPressUpdatePassword}
      />
    );
  }
}

interface StateProps {
  userError: ReturnType<typeof selectUserError>;
}

interface DispatchProps {
  updateUserPassword: typeof updateUserPassword;
}

const mapStateToProps = (state: RootState): StateProps => ({
  userError: selectUserError(state)
});

const mapDispatchToProps = {
  updateUserPassword
};

export const UpdatePasswordScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdatePasswordScreenContainer);
