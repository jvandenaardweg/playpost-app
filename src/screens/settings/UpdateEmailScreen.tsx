import React from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationRoute, NavigationStackScreenOptions, NavigationInjectedProps } from 'react-navigation';

import { ALERT_GENERIC_INTERNET_REQUIRED } from '../../constants/messages';

import { UpdateEmailForm } from '../../components/UpdateEmailForm';

import { RootState } from '../../reducers';
import { updateUserEmail, getUser } from '../../reducers/user';

import { getUserError } from '../../selectors/user';

import { NetworkContext } from '../../contexts/NetworkProvider';

interface State {
  isLoading: boolean;
  isSuccess: boolean;
  email: string;
  emailValidation: string;
  validationError: string;
}

interface IProps extends NavigationInjectedProps {}

interface StateProps {
  userError: string;
}

type Props = IProps & StateProps & DispatchProps;

export class UpdateEmailScreenContainer extends React.PureComponent<Props, State> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: 'Change e-mail address'
    };
  }

  state = {
    isLoading: false,
    isSuccess: false,
    email: '',
    emailValidation: '',
    validationError: '',
  };

  static contextType = NetworkContext;

  componentDidUpdate(prevProps: Props) {
    const { userError } = this.props;

    if (userError && prevProps.userError !== userError) {
      return Alert.alert('Oops!', userError);
    }
  }

  fetchUser = async () => {
    try {
      await this.props.getUser();
      this.setState({ isSuccess: true });
    } catch (err) {
      this.setState({ isSuccess: false });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  handleOnPressUpdateEmail = async () => {
    const { email, emailValidation, isSuccess } = this.state;
    const { isConnected } = this.context;

    if (!isConnected) return Alert.alert('Oops!', ALERT_GENERIC_INTERNET_REQUIRED);

    // Just navigate back to the settings screen
    if (isSuccess) return this.props.navigation.navigate('Settings');

    if (email !== emailValidation) {
      return Alert.alert('Oops!', 'The given e-mail addresses do not match. Please make sure you typed your e-mail address correctly.');
    }

    this.setState({ isLoading: true }, async () => {
      try {
        await this.props.updateUserEmail(email);

        // Get the user account details to update our store with the new e-mail address
        await this.fetchUser();
      } catch (err) {
        this.setState({ isSuccess: false, isLoading: false });
        // For errors, rely on the Redux state error we get through props
        return err;
      }
    });
  }

  handleOnChangeText = (field: 'email' | 'emailValidation', value: string) => {
    if (field === 'email') this.setState({ email: value });
    if (field === 'emailValidation') this.setState({ emailValidation: value });
  }

  render() {
    const { email, emailValidation, isLoading, isSuccess } = this.state;

    return (
      <UpdateEmailForm
        email={email}
        emailValidation={emailValidation}
        isLoading={isLoading}
        isSuccess={isSuccess}
        onChangeText={this.handleOnChangeText}
        onPressUpdateEmail={this.handleOnPressUpdateEmail}
      />
    );
  }
}

interface StateProps {
  userError: ReturnType<typeof getUserError>;
}

interface DispatchProps {
  updateUserEmail: typeof updateUserEmail;
  getUser: typeof getUser;
}

const mapStateToProps = (state: RootState): StateProps => ({
  userError: getUserError(state)
});

const mapDispatchToProps = {
  updateUserEmail,
  getUser
};

export const UpdateEmailScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateEmailScreenContainer);
