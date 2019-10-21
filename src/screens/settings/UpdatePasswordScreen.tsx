import React from 'react';
import { Alert } from 'react-native';
import { NavigationInjectedProps, NavigationRoute, NavigationScreenProp } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';
import { connect } from 'react-redux';

import { ALERT_GENERIC_INTERNET_REQUIRED, ALERT_TITLE_ERROR } from '../../constants/messages';

import { UpdatePasswordForm } from '../../components/UpdatePasswordForm';

import { RootState } from '../../reducers';
import { patchUser } from '../../reducers/user';

import { selectUserError } from '../../selectors/user';

import { NetworkContext } from '../../contexts/NetworkProvider';

interface State {
  isLoading: boolean;
  isSuccess: boolean;
  password: string;
  validationError: string;
}

interface StateProps {
  userError: string;
}

type Props = NavigationInjectedProps & StateProps & DispatchProps;

export class UpdatePasswordScreenContainer extends React.PureComponent<Props, State> {

  static contextType = NetworkContext;
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackOptions => {
    return {
      title: 'Change password'
    };
  }

  state = {
    isLoading: false,
    isSuccess: false,
    password: '',
    validationError: '',
  };

  navigationTimeout: NodeJS.Timeout | null = null;

  componentDidUpdate(prevProps: Props) {
    const { userError } = this.props;

    if (userError && prevProps.userError !== userError) {
      return Alert.alert(ALERT_TITLE_ERROR, userError);
    }
  }

  componentWillUnmount() {
    if (this.navigationTimeout) {
      clearTimeout(this.navigationTimeout);
    }
  }

  handleOnPressUpdatePassword = async () => {
    const { password, isSuccess } = this.state;
    const { isConnected } = this.context;

    if (!isConnected) { return Alert.alert(ALERT_TITLE_ERROR, ALERT_GENERIC_INTERNET_REQUIRED); }

    // Just navigate back to the settings screen
    if (isSuccess) { return this.props.navigation.navigate('Settings'); }

    this.setState({ isLoading: true }, async () => {
      try {
        await this.props.patchUser({ password });
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

  handleOnChangeText = (field: 'password' | 'passwordValidation', value: string) => {
    if (field === 'password') { this.setState({ password: value }); }
  }

  render() {
    const { password, isLoading, isSuccess } = this.state;

    return (
      <UpdatePasswordForm
        password={password}
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
  patchUser: typeof patchUser;
}

const mapStateToProps = (state: RootState): StateProps => ({
  userError: selectUserError(state)
});

const mapDispatchToProps = {
  patchUser
};

export const UpdatePasswordScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdatePasswordScreenContainer);
