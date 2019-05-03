import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-native';
import { NavigationScreenProp, NavigationRoute, NavigationStackScreenOptions, NavigationInjectedProps } from 'react-navigation';
import * as Keychain from 'react-native-keychain';

import { SignupForm } from '../components/SignupForm';
import { ButtonClose } from '../components/Header/ButtonClose';

import { createUser } from '../reducers/user';
import { postAuth } from '../reducers/auth';

import { getAuthError } from '../selectors/auth';
import { getUserError } from '../selectors/user';
import { RootState } from '../reducers';

/* tslint:disable no-any */
interface State {
  isLoading: boolean;
  email: string;
  password: string;
  passwordValidation: string;
  validationError: string;
  showModal: boolean;
  error: any;
}

interface IProps extends NavigationInjectedProps {}

interface StateProps {
  authError: string;
  userError: string;
}

type Props = IProps & StateProps & DispatchProps;

class SignupScreenContainer extends React.PureComponent<Props, State> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<NavigationRoute> }): NavigationStackScreenOptions => {
    return {
      title: 'Signup',
      headerLeft: null,
      headerRight: <ButtonClose onPress={navigation.getParam('handleOnClose')} />
    };
  }

  state = {
    isLoading: false,
    email: '',
    password: '',
    passwordValidation: '',
    validationError: '',
    showModal: false,
    error: null
  };

  /**
   * Saves the token in our secure storage and redirects to user to the success page
   */
  saveToken = async (token: string) => {
    try {
      await Keychain.setGenericPassword('token', token, { accessGroup: 'group.playpost', service: 'com.aardwegmedia.playpost' });
      this.props.navigation.navigate('SignupSuccess');
    } catch (err) {
      Alert.alert('Oops!', 'We have successfully created your account, but could not log you in. Please try logging in manually.');
      this.setState({ isLoading: false });
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleOnClose: this.handleOnClose });
  }

  handleOnClose = () => {
    this.props.navigation.goBack();
  }

  componentDidUpdate(prevProps: Props) {
    const { userError, authError } = this.props;

    if (authError && prevProps.authError !== authError) {
      return Alert.alert('Oops!', authError);
    }

    if (userError && prevProps.userError !== userError) {
      return Alert.alert('Oops!', userError);
    }
  }

  /**
   * Automatically logs the user in by using their given email and password
   * Providing some ease of use
   */
  autoLogin = async () => {
    const { email, password } = this.state;

    try {
      const response: any = await this.props.postAuth(email, password);
      this.saveToken(response.payload.data.token);
    } catch (err) {
      this.setState({ error: err, isLoading: false });
    }
  }

  handleOnPressSignup = async () => {
    const { email, password, passwordValidation } = this.state;

    if (password !== passwordValidation) {
      return Alert.alert('Oops!', 'The given passwords do not match. Please make sure you typed your passwords correctly.');
    }

    this.setState({ isLoading: true }, async () => {
      try {
        await this.props.createUser(email, password);
        this.autoLogin();
      } catch (err) {
        this.setState({ error: err, isLoading: false });
      }
    });
  }

  handleOnPressLogin = () => this.props.navigation.navigate('Login');

  handleOnChangeText = (field: 'email' | 'password' | 'passwordValidation', value: string) => {
    if (field === 'email') this.setState({ email: value });
    if (field === 'password') this.setState({ password: value });
    if (field === 'passwordValidation') this.setState({ passwordValidation: value });
  }

  handleOnPressOpenModal = (title: string, url: string) => this.props.navigation.navigate('ModalBrowser', { title, url });

  render() {
    const { email, password, passwordValidation, isLoading } = this.state;

    return (
      <SignupForm
        email={email}
        password={password}
        passwordValidation={passwordValidation}
        isLoading={isLoading}
        onChangeText={this.handleOnChangeText}
        onPressLogin={this.handleOnPressLogin}
        onPressSignup={this.handleOnPressSignup}
      />
    );
  }
}

interface StateProps {
  authError: ReturnType<typeof getAuthError>;
  userError: ReturnType<typeof getUserError>;
}

interface DispatchProps {
  createUser: typeof createUser;
  postAuth: typeof postAuth;
}

const mapStateToProps = (state: RootState): StateProps => ({
  authError: getAuthError(state),
  userError: getUserError(state)
});

const mapDispatchToProps = {
  createUser,
  postAuth
};

export const SignupScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupScreenContainer);
