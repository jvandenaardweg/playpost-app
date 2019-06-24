import React from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { connect } from 'react-redux';

import { selectUserErrorSaveSelectedVoice } from '../selectors/user';
import { RootState } from '../reducers';
import { resetSaveSelectedVoiceError } from '../reducers/user';
import { resetCreateAudiofileError } from '../reducers/player';
import { Alert } from 'react-native';
import { selectErrorCreateAudiofile } from '../selectors/player';
import { resetValidateSubscriptionReceiptError } from '../reducers/subscriptions';
import { selectErrorValidateSubscriptionReceipt } from '../selectors/subscriptions';

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
    const { errorSaveSelectedVoice, errorCreateAudiofile, errorValidateSubscriptionReceipt } = this.props;

    if (errorSaveSelectedVoice && prevProps.errorSaveSelectedVoice !== errorSaveSelectedVoice) {
      return Alert.alert(
        'Oops!',
        errorSaveSelectedVoice,
        [
          {
            text: 'OK',
            style: 'cancel',
            onPress: () => this.props.resetSaveSelectedVoiceError()
          }
        ]
      );
    }

    if (errorCreateAudiofile && prevProps.errorCreateAudiofile !== errorCreateAudiofile) {
      return Alert.alert(
        'Oops!',
        errorCreateAudiofile,
        [
          {
            text: 'OK',
            style: 'cancel',
            onPress: () => this.props.resetCreateAudiofileError()
          }
        ]
      );
    }

    if (errorValidateSubscriptionReceipt && prevProps.errorValidateSubscriptionReceipt !== errorValidateSubscriptionReceipt) {
      return Alert.alert(
        'Oops!',
        errorValidateSubscriptionReceipt,
        [
          {
            text: 'OK',
            style: 'cancel',
            onPress: () => this.props.resetValidateSubscriptionReceiptError()
          }
        ]
      );
    }
  }

  render () {
    return this.props.children;
  }
}

interface DispatchProps {
  resetSaveSelectedVoiceError: typeof resetSaveSelectedVoiceError;
  resetCreateAudiofileError: typeof resetCreateAudiofileError;
  resetValidateSubscriptionReceiptError: typeof resetValidateSubscriptionReceiptError;
}

interface StateProps {
  readonly errorSaveSelectedVoice: ReturnType<typeof selectUserErrorSaveSelectedVoice>;
  readonly errorCreateAudiofile: ReturnType<typeof selectErrorCreateAudiofile>;
  readonly errorValidateSubscriptionReceipt: ReturnType<typeof selectErrorValidateSubscriptionReceipt>;
}

const mapStateToProps = (state: RootState, props: Props) => ({
  errorSaveSelectedVoice: selectUserErrorSaveSelectedVoice(state),
  errorCreateAudiofile: selectErrorCreateAudiofile(state),
  errorValidateSubscriptionReceipt: selectErrorValidateSubscriptionReceipt(state)
});

const mapDispatchToProps = {
  resetSaveSelectedVoiceError,
  resetCreateAudiofileError,
  resetValidateSubscriptionReceiptError
};

export const APIErrorAlertContainer =
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(APIErrorAlertContainerComponent);
