import React from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationRoute, NavigationStackScreenOptions, NavigationInjectedProps } from 'react-navigation';

import { ALERT_GENERIC_INTERNET_REQUIRED } from '../../constants/messages';

import { UpdateEmailForm } from '../../components/UpdateEmailForm';

import { RootState } from '../../reducers';
import { updateUserEmail } from '../../reducers/user';

import { getUserError, getUserDetails } from '../../selectors/user';

import { NetworkContext } from '../../contexts/NetworkProvider';

interface State {
  isLoading: boolean;
  isSuccess: boolean;
  email: string;
  previousEmail: string;
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
    previousEmail: '',
    emailValidation: '',
    validationError: '',
  };

  static contextType = NetworkContext;

  componentDidMount() {
    const { userDetails } = this.props;

    if (userDetails && userDetails.email) {
      this.setState({
        email: userDetails.email,
        previousEmail: userDetails.email
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { userError } = this.props;

    if (userError && prevProps.userError !== userError) {
      return Alert.alert('Oops!', userError);
    }
  }

  handleOnPressUpdateEmail = async () => {
    const { email, previousEmail, isSuccess } = this.state;
    const { isConnected } = this.context;

    if (!isConnected) return Alert.alert('Oops!', ALERT_GENERIC_INTERNET_REQUIRED);

    if (email === previousEmail) {
      return Alert.alert('Nothing to update...', 'The e-mail address given is the same. No need to update :-)');
    }

    // If the user clicks on the button after a success
    if (isSuccess) return this.props.navigation.navigate('Settings');

    this.setState({ isLoading: true }, async () => {
      try {
        await this.props.updateUserEmail(email);

        return this.setState({ isSuccess: true, isLoading: false }, () => {
          setTimeout(() => this.props.navigation.navigate('Settings'), 2000);
        });
      } catch (err) {
        this.setState({ isSuccess: false, isLoading: false });
        // For errors, rely on the Redux state error we get through props
        return err;
      }
    });
  }

  handleOnChangeText = (field: 'email', value: string) => {
    if (field === 'email') this.setState({ email: value });
  }

  render() {
    const { email, isLoading, isSuccess } = this.state;

    return (
      <UpdateEmailForm
        email={email}
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
  userDetails: ReturnType<typeof getUserDetails>;
}

interface DispatchProps {
  updateUserEmail: typeof updateUserEmail;
}

const mapStateToProps = (state: RootState): StateProps => ({
  userError: getUserError(state),
  userDetails: getUserDetails(state)
});

const mapDispatchToProps = {
  updateUserEmail
};

export const UpdateEmailScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateEmailScreenContainer);
