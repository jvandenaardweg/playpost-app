import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { MeState } from '../../reducers/me';
import Icon from 'react-native-vector-icons/Feather';

import styles from './styles';
import { UsersState } from '../../reducers/users';
import { AuthState } from '../../reducers/auth';

interface State {
  errorMessage: string | null
  forceClose: boolean
}

interface Props {
  me: MeState
  users: UsersState
  auth: AuthState
}

class ErrorMessageContainer extends React.PureComponent<Props, State> {
  state = {
    errorMessage: null,
    forceClose: false
  }

  errorMessages() {
    const meError = this.props.me.error;
    const authError = this.props.auth.error;
    const usersError = this.props.users.error

    let errors = [];

    if (meError) errors.push(meError);
    if (authError) errors.push(authError);
    if (usersError) errors.push(usersError);

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

const mapStateToProps = (state: { me: MeState, users: UsersState, auth: AuthState}) => ({
  me: state.me,
  users: state.users,
  auth: state.auth
});

const mapDispatchToProps = {};

export const ErrorMessage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorMessageContainer);
