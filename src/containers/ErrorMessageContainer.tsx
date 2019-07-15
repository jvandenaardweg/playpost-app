import React from 'react';
import { connect } from 'react-redux';

import { ErrorMessage } from '../components/ErrorMessage';
import { RootState } from '../reducers';
import { resetAuthError } from '../reducers/auth';
import { resetUserError } from '../reducers/user';
import { selectAuthError } from '../selectors/auth';
import { selectUserError } from '../selectors/user';

interface State {
  forceClose: boolean;
}

interface IProps {
  userError: string;
  authError: string;
}

type Props = IProps & StateProps & DispatchProps;

class ErrorMessageContainerComponent extends React.PureComponent<Props, State> {
  public state = {
    forceClose: false
  };

  public errorMessages() {
    const { userError, authError } = this.props;

    const errors = [];

    if (userError) { errors.push(userError); }
    if (authError) { errors.push(authError); }

    return errors.join(',');
  }

  public handleOnPressClose = () => {
    const { userError, authError } = this.props;

    this.setState({ forceClose: true }, () => {
      // Reset the errors, so it does not pop up anymore
      if (userError) { this.props.resetUserError(); }
      if (authError) { this.props.resetAuthError(); }
    });
  }

  public render () {
    const { forceClose } = this.state;

    // Don't render when we do not have a message to display
    if (!this.errorMessages() || forceClose) { return null; }

    return (
      <ErrorMessage
        onPressClose={this.handleOnPressClose}
        errorMessages={this.errorMessages()}
      />
    );
  }
}

interface StateProps {
  userError: ReturnType<typeof selectUserError>;
  authError: ReturnType<typeof selectAuthError>;
}

interface DispatchProps {
  resetUserError: typeof resetUserError;
  resetAuthError: typeof resetAuthError;
}

const mapStateToProps = (state: RootState) => ({
  userError: selectUserError(state),
  authError: selectAuthError(state)
});

const mapDispatchToProps = {
  resetUserError,
  resetAuthError
};

export const ErrorMessageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorMessageContainerComponent);
