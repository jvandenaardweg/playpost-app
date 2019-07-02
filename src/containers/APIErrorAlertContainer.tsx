import React from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Alert } from 'react-native';

import { selectUserErrorSaveSelectedVoice } from '../selectors/user';
import { RootState } from '../reducers';
import { resetSaveSelectedVoiceError } from '../reducers/user';
import { resetCreateAudiofileError } from '../reducers/player';
import { selectErrorCreateAudiofile } from '../selectors/player';
import { resetValidateSubscriptionReceiptError } from '../reducers/subscriptions';
import { selectErrorValidateSubscriptionReceipt } from '../selectors/subscriptions';
import { selectErrorUpdatePassword, selectErrorRequestResetPasswordToken } from '../selectors/auth';
import { resetErrorUpdatePassword, resetErrorRequestPasswordToken } from '../reducers/auth';
import { selectPlaylistError } from '../selectors/playlist';
import { resetErrorPlaylist } from '../reducers/playlist';

type IProps = {
  languageName: string;
};

type Props = IProps & NavigationInjectedProps & StateProps & DispatchProps;

/**
 * This component handles API errors and show them as an Alert to the user.
 *
 * When creating errors in the API, make sure they will be understood by the end-user.
 */
export class APIErrorAlertContainerComponent extends React.PureComponent<Props> {
  componentDidUpdate(prevProps: Props) {
    const {
      errorSaveSelectedVoice,
      errorCreateAudiofile,
      errorValidateSubscriptionReceipt,
      errorUpdatePassword,
      errorRequestResetPasswordToken,
      errorPlaylist
    } = this.props;

    if (errorSaveSelectedVoice && prevProps.errorSaveSelectedVoice !== errorSaveSelectedVoice) {
      return Alert.alert('Oops!', errorSaveSelectedVoice, [
        {
          text: 'OK',
          style: 'cancel',
          onPress: () => this.props.resetSaveSelectedVoiceError()
        }
      ]);
    }

    if (errorCreateAudiofile && prevProps.errorCreateAudiofile !== errorCreateAudiofile) {
      return Alert.alert('Oops!', errorCreateAudiofile, [
        {
          text: 'OK',
          style: 'cancel',
          onPress: () => this.props.resetCreateAudiofileError()
        }
      ]);
    }

    if (errorValidateSubscriptionReceipt && prevProps.errorValidateSubscriptionReceipt !== errorValidateSubscriptionReceipt) {
      return Alert.alert('Oops!', errorValidateSubscriptionReceipt, [
        {
          text: 'OK',
          style: 'cancel',
          onPress: () => this.props.resetValidateSubscriptionReceiptError()
        }
      ]);
    }

    if (errorUpdatePassword && prevProps.errorUpdatePassword !== errorUpdatePassword) {
      return Alert.alert('Oops!', errorUpdatePassword, [
        {
          text: 'OK',
          style: 'cancel',
          onPress: () => this.props.resetErrorUpdatePassword()
        }
      ]);
    }

    if (errorRequestResetPasswordToken && prevProps.errorRequestResetPasswordToken !== errorRequestResetPasswordToken) {
      return Alert.alert('Oops!', errorRequestResetPasswordToken, [
        {
          text: 'OK',
          style: 'cancel',
          onPress: () => this.props.resetErrorRequestPasswordToken()
        }
      ]);
    }

    if (errorPlaylist && prevProps.errorPlaylist !== errorPlaylist) {
      return Alert.alert('Oops!', errorPlaylist, [
        {
          text: 'OK',
          style: 'cancel',
          onPress: () => this.props.resetErrorPlaylist()
        }
      ]);
    }
  }

  render() {
    return this.props.children;
  }
}

interface DispatchProps {
  resetSaveSelectedVoiceError: typeof resetSaveSelectedVoiceError;
  resetCreateAudiofileError: typeof resetCreateAudiofileError;
  resetValidateSubscriptionReceiptError: typeof resetValidateSubscriptionReceiptError;
  resetErrorUpdatePassword: typeof resetErrorUpdatePassword;
  resetErrorRequestPasswordToken: typeof resetErrorRequestPasswordToken;
  resetErrorPlaylist: typeof resetErrorPlaylist;
}

interface StateProps {
  readonly errorSaveSelectedVoice: ReturnType<typeof selectUserErrorSaveSelectedVoice>;
  readonly errorCreateAudiofile: ReturnType<typeof selectErrorCreateAudiofile>;
  readonly errorValidateSubscriptionReceipt: ReturnType<typeof selectErrorValidateSubscriptionReceipt>;
  readonly errorUpdatePassword: ReturnType<typeof selectErrorUpdatePassword>;
  readonly errorRequestResetPasswordToken: ReturnType<typeof selectErrorRequestResetPasswordToken>;
  readonly errorPlaylist: ReturnType<typeof selectPlaylistError>;
}

const mapStateToProps = (state: RootState, props: Props) => ({
  errorSaveSelectedVoice: selectUserErrorSaveSelectedVoice(state),
  errorCreateAudiofile: selectErrorCreateAudiofile(state),
  errorValidateSubscriptionReceipt: selectErrorValidateSubscriptionReceipt(state),
  errorUpdatePassword: selectErrorUpdatePassword(state),
  errorRequestResetPasswordToken: selectErrorRequestResetPasswordToken(state),
  errorPlaylist: selectPlaylistError(state)
});

const mapDispatchToProps = {
  resetSaveSelectedVoiceError,
  resetCreateAudiofileError,
  resetValidateSubscriptionReceiptError,
  resetErrorUpdatePassword,
  resetErrorRequestPasswordToken,
  resetErrorPlaylist
};

export const APIErrorAlertContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(APIErrorAlertContainerComponent);
