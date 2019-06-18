import React from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { connect } from 'react-redux';

import { selectUserErrorSaveSelectedVoice } from '../selectors/user';
import { RootState } from '../reducers';
import { resetSaveSelectedVoiceError } from '../reducers/user';
import { resetCreateAudiofileError } from '../reducers/player';
import { Alert } from 'react-native';
import { selectErrorCreateAudiofile } from '../selectors/player';

type IProps = {
  languageName: string;
};

type Props = IProps & NavigationInjectedProps & StateProps & DispatchProps;

export class ErrorAlertContainerComponent extends React.PureComponent<Props> {
  componentDidUpdate(prevProps: Props) {
    const { errorSaveSelectedVoice, errorCreateAudiofile } = this.props;

    if (errorSaveSelectedVoice && prevProps.errorSaveSelectedVoice !== errorSaveSelectedVoice) {
      return Alert.alert(
        'Oops!',
        errorSaveSelectedVoice,
        [
          {
            text: 'OK',
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
            onPress: () => this.props.resetCreateAudiofileError()
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
}

interface StateProps {
  readonly errorSaveSelectedVoice: ReturnType<typeof selectUserErrorSaveSelectedVoice>;
  readonly errorCreateAudiofile: ReturnType<typeof selectErrorCreateAudiofile>;
}

const mapStateToProps = (state: RootState, props: Props) => ({
  errorSaveSelectedVoice: selectUserErrorSaveSelectedVoice(state),
  errorCreateAudiofile: selectErrorCreateAudiofile(state),
});

const mapDispatchToProps = {
  resetSaveSelectedVoiceError,
  resetCreateAudiofileError
};

export const ErrorAlertContainer =
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ErrorAlertContainerComponent);
