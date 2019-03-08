import * as React from 'React';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { UserState } from '../../reducers/user';
import Icon from 'react-native-vector-icons/Feather';

import styles from './styles';
import { AuthState } from '../../reducers/auth';

interface State {
  errorMessage: string | null
  forceClose: boolean
}

interface Props {
  user: UserState
  auth: AuthState
}

class ErrorMessageContainer extends React.PureComponent<Props, State> {
  state = {
    errorMessage: null,
    forceClose: false
  }

  errorMessages() {
    const userError = this.props.user.error;
    const authError = this.props.auth.error;

    let errors = [];

    if (userError) errors.push(userError);
    if (authError) errors.push(authError);

    return errors.join(',');
  }

  handleOnPressClose = () => {
    this.setState({ forceClose: true });
  }

  render () {
    const { forceClose } = this.state;

    // Don't render when we do not have a message to display
    if (!this.errorMessages() || forceClose) return null;

    return (
      <TouchableOpacity style={styles.container} activeOpacity={1} onPress={this.handleOnPressClose}>
        <View style={styles.content}>
          <Text style={{ color: '#fff', fontWeight: '700', marginBottom: 6}}>Oh no! An error happened...</Text>
          <Text style={{ color: '#fff'}}>{this.errorMessages()}</Text>
        </View>
        <View style={styles.button}><Icon name="x-circle" size={24} color="#fff" /></View>
      </TouchableOpacity>
    )
  }
}

const mapStateToProps = (state: { user: UserState, auth: AuthState}) => ({
  user: state.user,
  auth: state.auth
});

const mapDispatchToProps = {};

export const ErrorMessage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorMessageContainer);
