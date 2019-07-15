import React from 'react';
import { Alert } from 'react-native';
import { NavigationInjectedProps, NavigationRoute, NavigationScreenProp, NavigationStackScreenOptions } from 'react-navigation';
import { connect } from 'react-redux';

import { ALERT_GENERIC_INTERNET_REQUIRED } from '../../constants/messages';

import { UpdateEmailForm } from '../../components/UpdateEmailForm';

import { RootState } from '../../reducers';
import { getUser, updateUserEmail } from '../../reducers/user';

import { selectUserDetails, selectUserError } from '../../selectors/user';

import { NetworkContext } from '../../contexts/NetworkProvider';

interface State {
  isLoading: boolean;
  isSuccess: boolean;
  email: string;
  previousEmail: string;
  validationError: string;
}

interface StateProps {
  userError: string;
}

type Props = NavigationInjectedProps & StateProps & DispatchProps;

export class UpdateEmailScreenContainer extends React.PureComponent<Props, State> {

  public static contextType = NetworkContext;
  public static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: 'Change e-mail'
    };
  }

  public state = {
    isLoading: false,
    isSuccess: false,
    email: '',
    previousEmail: '',
    emailValidation: '',
    validationError: '',
  };

  public navigationTimeout: NodeJS.Timeout | null = null;

  public componentDidMount() {
    const { userDetails } = this.props;

    if (userDetails && userDetails.email) {
      this.setState({
        email: userDetails.email,
        previousEmail: userDetails.email
      });
    }
  }

  public componentWillUnmount() {
    if (this.navigationTimeout) {
      clearTimeout(this.navigationTimeout);
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const { userError } = this.props;

    if (userError && prevProps.userError !== userError) {
      return Alert.alert('Oops!', userError);
    }
  }

  public handleOnPressUpdateEmail = async () => {
    const { email, previousEmail, isSuccess } = this.state;
    const { isConnected } = this.context;

    if (!isConnected) { return Alert.alert('Oops!', ALERT_GENERIC_INTERNET_REQUIRED); }

    if (email === previousEmail) {
      return Alert.alert('Nothing to update...', 'The e-mail address given is the same. No need to update :-)');
    }

    // If the user clicks on the button after a success
    if (isSuccess) { return this.props.navigation.navigate('Settings'); }

    this.setState({ isLoading: true }, async () => {
      try {
        await this.props.updateUserEmail(email);

        await this.props.getUser();

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

  public handleOnChangeText = (field: 'email', value: string) => {
    if (field === 'email') { this.setState({ email: value }); }
  }

  public render() {
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
  userError: ReturnType<typeof selectUserError>;
  userDetails: ReturnType<typeof selectUserDetails>;
}

interface DispatchProps {
  updateUserEmail: typeof updateUserEmail;
  getUser: typeof getUser;
}

const mapStateToProps = (state: RootState): StateProps => ({
  userError: selectUserError(state),
  userDetails: selectUserDetails(state)
});

const mapDispatchToProps = {
  updateUserEmail,
  getUser
};

export const UpdateEmailScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateEmailScreenContainer);
