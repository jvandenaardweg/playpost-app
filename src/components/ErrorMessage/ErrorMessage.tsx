import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';

import styles from './styles';

import { getUserError } from '../../selectors/user';
import { getAuthError } from '../../selectors/auth';
import { RootState } from '../../reducers';

interface State {
  forceClose: boolean;
}

interface Props {
  userError: string | null;
  authError: string | null;
}

class ErrorMessageContainer extends React.PureComponent<Props, State> {
  state = {
    forceClose: false
  };

  errorMessages() {
    const { userError, authError } = this.props;

    const errors = [];

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
          <Text style={{ color: '#fff', fontWeight: '700', marginBottom: 6 }}>Oh no! An error happened...</Text>
          <Text style={{ color: '#fff' }}>{this.errorMessages()}</Text>
        </View>
        <View style={styles.button}><Icon name="x-circle" size={24} color="#fff" /></View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  userError: getUserError(state),
  authError: getAuthError(state)
});

const mapDispatchToProps = {};

export const ErrorMessage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorMessageContainer);
