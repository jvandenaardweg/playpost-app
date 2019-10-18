import React from 'react';
import { Alert, InteractionManager } from 'react-native';
import { NavigationInjectedProps, NavigationRoute, NavigationScreenProp, SafeAreaView } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';
import { connect } from 'react-redux';

import { ALERT_GENERIC_INTERNET_REQUIRED, ALERT_SETTINGS_UPDATE_EMAIL_DIFF, ALERT_TITLE_ERROR, ALERT_TITLE_NO_UPDATE } from '../../constants/messages';

import { UpdateEmailForm } from '../../components/UpdateEmailForm';

import { RootState } from '../../reducers';
import { getUser, patchUser } from '../../reducers/user';

import { selectUserDetails, selectUserError } from '../../selectors/user';

import { AppBackground } from '../../components/AppBackground';
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

  static contextType = NetworkContext;
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackOptions => {
    return {
      title: 'Change e-mail'
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

  navigationTimeout: NodeJS.Timeout | null = null;

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      const { userDetails } = this.props;

      if (userDetails && userDetails.email) {
        this.setState({
          email: userDetails.email,
          previousEmail: userDetails.email
        });
      }
    })
  }

  componentWillUnmount() {
    if (this.navigationTimeout) {
      clearTimeout(this.navigationTimeout);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { userError } = this.props;

    if (userError && prevProps.userError !== userError) {
      return Alert.alert(ALERT_TITLE_ERROR, userError);
    }
  }

  handleOnPressUpdateEmail = async () => {
    const { email, previousEmail, isSuccess } = this.state;
    const { isConnected } = this.context;

    if (!isConnected) { return Alert.alert(ALERT_TITLE_ERROR, ALERT_GENERIC_INTERNET_REQUIRED); }

    if (email === previousEmail) {
      return Alert.alert(ALERT_TITLE_NO_UPDATE, ALERT_SETTINGS_UPDATE_EMAIL_DIFF);
    }

    // If the user clicks on the button after a success
    if (isSuccess) { return this.props.navigation.navigate('Settings'); }

    this.setState({ isLoading: true }, async () => {
      try {
        await this.props.patchUser({ email });

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

  handleOnChangeText = (field: 'email', value: string) => {
    if (field === 'email') { this.setState({ email: value }); }
  }

  render() {
    const { email, isLoading, isSuccess } = this.state;

    return (
      <AppBackground>
        <SafeAreaView style={{ flex: 1 }}>
          <UpdateEmailForm
            email={email}
            isLoading={isLoading}
            isSuccess={isSuccess}
            onChangeText={this.handleOnChangeText}
            onPressUpdateEmail={this.handleOnPressUpdateEmail}
          />
        </SafeAreaView>
      </AppBackground>
    );
  }
}

interface StateProps {
  userError: ReturnType<typeof selectUserError>;
  userDetails: ReturnType<typeof selectUserDetails>;
}

interface DispatchProps {
  patchUser: typeof patchUser;
  getUser: typeof getUser;
}

const mapStateToProps = (state: RootState): StateProps => ({
  userError: selectUserError(state),
  userDetails: selectUserDetails(state)
});

const mapDispatchToProps = {
  patchUser,
  getUser
};

export const UpdateEmailScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateEmailScreenContainer);
