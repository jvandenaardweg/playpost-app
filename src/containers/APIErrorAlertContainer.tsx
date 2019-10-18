import React from 'react';
import { Alert } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { connect } from 'react-redux';

import { NetworkContext } from '../contexts/NetworkProvider';
import { RootState } from '../reducers';
import { resetErrorRequestPasswordToken, resetErrorUpdatePassword } from '../reducers/auth';
import { resetCreateAudiofileError } from '../reducers/player';
import { resetErrorPlaylist } from '../reducers/playlist';
import { resetValidateSubscriptionReceiptError } from '../reducers/subscriptions';
import { resetSaveSelectedVoiceError, resetUserError } from '../reducers/user';
import { resetVoicesError } from '../reducers/voices';
import { selectErrorRequestResetPasswordToken, selectErrorUpdatePassword } from '../selectors/auth';
import { selectErrorCreateAudiofile } from '../selectors/player';
import { selectPlaylistError } from '../selectors/playlist';
import { selectErrorValidateSubscriptionReceipt, selectIsActiveUpgradeModal } from '../selectors/subscriptions';
import { selectUserError, selectUserErrorSaveSelectedVoice } from '../selectors/user';
import { selectVoicesError } from '../selectors/voices';

interface IProps {
  languageName: string;
}

interface State {
  hasOpenAlert: boolean;
}

type Props = IProps & NavigationInjectedProps & StateProps & DispatchProps;

/**
 * This component handles API errors and show them as an Alert to the user.
 *
 * When creating errors in the API, make sure they will be understood by the end-user.
 */
export class APIErrorAlertContainerComponent extends React.Component<Props, State> {

  static contextType = NetworkContext;

  state = {
    hasOpenAlert: false // A way to prevent multiple alerts being thrown at the user
  };

  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    // Just do not update the component when we already have an Alert open
    if (!nextState.hasOpenAlert) {
      return true;
    }

    return false;
  }

  componentDidUpdate(prevProps: Props): void {
    const {
      errorSaveSelectedVoice,
      errorCreateAudiofile,
      errorValidateSubscriptionReceipt,
      errorUpdatePassword,
      errorRequestResetPasswordToken,
      errorPlaylist,
      errorVoices,
      errorUser,
      isActiveUpgradeModal
    } = this.props;

    const { isConnected } = this.context;

    // Do not show alert's when there are custom modals active
    if (isActiveUpgradeModal) {
      return;
    }

    // Do not show alerts when not connected to the internet
    if (!isConnected) {
      return;
    }

    if (errorSaveSelectedVoice && prevProps.errorSaveSelectedVoice !== errorSaveSelectedVoice) {
      return this.setState({ hasOpenAlert: true }, () => {
        return Alert.alert(
          'Oops!',
          errorSaveSelectedVoice,
          [
            {
              text: 'OK',
              style: 'cancel',
              onPress: () => this.setState({ hasOpenAlert: false }, () => this.props.resetSaveSelectedVoiceError())
            }
          ],
          { cancelable: false }
        );
      });
    }

    if (errorCreateAudiofile && prevProps.errorCreateAudiofile !== errorCreateAudiofile) {
      return this.setState({ hasOpenAlert: true }, () => {
        return Alert.alert(
          'Oops!',
          errorCreateAudiofile,
          [
            {
              text: 'OK',
              style: 'cancel',
              onPress: () => this.setState({ hasOpenAlert: false }, () => this.props.resetCreateAudiofileError())
            }
          ],
          { cancelable: false }
        );
      });
    }

    if (errorValidateSubscriptionReceipt && prevProps.errorValidateSubscriptionReceipt !== errorValidateSubscriptionReceipt) {
      return this.setState({ hasOpenAlert: true }, () => {
        return Alert.alert(
          'Oops!',
          errorValidateSubscriptionReceipt,
          [
            {
              text: 'OK',
              style: 'cancel',
              onPress: () => this.setState({ hasOpenAlert: false }, () => this.props.resetValidateSubscriptionReceiptError())
            }
          ],
          { cancelable: false }
        );
      });
    }

    if (errorUpdatePassword && prevProps.errorUpdatePassword !== errorUpdatePassword) {
      return this.setState({ hasOpenAlert: true }, () => {
        return Alert.alert(
          'Oops!',
          errorUpdatePassword,
          [
            {
              text: 'OK',
              style: 'cancel',
              onPress: () => this.setState({ hasOpenAlert: false }, () => this.props.resetErrorUpdatePassword())
            }
          ],
          { cancelable: false }
        );
      });
    }
    if (errorRequestResetPasswordToken && prevProps.errorRequestResetPasswordToken !== errorRequestResetPasswordToken) {
      return this.setState({ hasOpenAlert: true }, () => {
        return Alert.alert(
          'Oops!',
          errorRequestResetPasswordToken,
          [
            {
              text: 'OK',
              style: 'cancel',
              onPress: () => this.setState({ hasOpenAlert: false }, () => this.props.resetErrorRequestPasswordToken())
            }
          ],
          { cancelable: false }
        );
      });
    }

    if (errorPlaylist && prevProps.errorPlaylist !== errorPlaylist) {
      return this.setState({ hasOpenAlert: true }, () => {
        return Alert.alert(
          'Oops!',
          errorPlaylist,
          [
            {
              text: 'OK',
              style: 'cancel',
              onPress: () => this.setState({ hasOpenAlert: false }, () => this.props.resetErrorPlaylist())
            }
          ],
          { cancelable: false }
        );
      });
    }

    if (errorVoices && prevProps.errorVoices !== errorVoices) {
      return this.setState({ hasOpenAlert: true }, () => {
        return Alert.alert(
          'Oops!',
          errorVoices,
          [
            {
              text: 'OK',
              style: 'cancel',
              onPress: () => this.setState({ hasOpenAlert: false }, () => this.props.resetVoicesError())
            }
          ],
          { cancelable: false }
        );
      });
    }

    if (errorUser && prevProps.errorUser !== errorUser) {
      return this.setState({ hasOpenAlert: true }, () => {
        return Alert.alert(
          'Oops!',
          errorUser,
          [
            {
              text: 'OK',
              style: 'cancel',
              onPress: () => this.setState({ hasOpenAlert: false }, () => this.props.resetUserError())
            }
          ],
          { cancelable: false }
        );
      });
    }
  }

  render() {
    return null;
  }
}

interface DispatchProps {
  resetSaveSelectedVoiceError: typeof resetSaveSelectedVoiceError;
  resetCreateAudiofileError: typeof resetCreateAudiofileError;
  resetValidateSubscriptionReceiptError: typeof resetValidateSubscriptionReceiptError;
  resetErrorUpdatePassword: typeof resetErrorUpdatePassword;
  resetErrorRequestPasswordToken: typeof resetErrorRequestPasswordToken;
  resetErrorPlaylist: typeof resetErrorPlaylist;
  resetUserError: typeof resetUserError;
  resetVoicesError: typeof resetVoicesError;
}

interface StateProps {
  readonly errorSaveSelectedVoice: ReturnType<typeof selectUserErrorSaveSelectedVoice>;
  readonly errorCreateAudiofile: ReturnType<typeof selectErrorCreateAudiofile>;
  readonly errorValidateSubscriptionReceipt: ReturnType<typeof selectErrorValidateSubscriptionReceipt>;
  readonly errorUpdatePassword: ReturnType<typeof selectErrorUpdatePassword>;
  readonly errorRequestResetPasswordToken: ReturnType<typeof selectErrorRequestResetPasswordToken>;
  readonly errorPlaylist: ReturnType<typeof selectPlaylistError>;
  readonly errorVoices: ReturnType<typeof selectVoicesError>;
  readonly errorUser: ReturnType<typeof selectUserError>;
  readonly isActiveUpgradeModal: ReturnType<typeof selectIsActiveUpgradeModal>;
}

const mapStateToProps = (state: RootState, props: Props) => ({
  errorSaveSelectedVoice: selectUserErrorSaveSelectedVoice(state),
  errorCreateAudiofile: selectErrorCreateAudiofile(state),
  errorValidateSubscriptionReceipt: selectErrorValidateSubscriptionReceipt(state),
  errorUpdatePassword: selectErrorUpdatePassword(state),
  errorRequestResetPasswordToken: selectErrorRequestResetPasswordToken(state),
  errorPlaylist: selectPlaylistError(state),
  errorVoices: selectVoicesError(state),
  errorUser: selectUserError(state),
  isActiveUpgradeModal: selectIsActiveUpgradeModal(state),

});

const mapDispatchToProps = {
  resetSaveSelectedVoiceError,
  resetCreateAudiofileError,
  resetValidateSubscriptionReceiptError,
  resetErrorUpdatePassword,
  resetErrorRequestPasswordToken,
  resetErrorPlaylist,
  resetUserError,
  resetVoicesError
};

export const APIErrorAlertContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(APIErrorAlertContainerComponent);
