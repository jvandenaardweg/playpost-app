import React from 'react';
import { connect } from 'react-redux';

import { GlobalStatusIndicator } from '../components/GlobalStatusIndicator';

import { RootState } from '../reducers';
import { selectPlayerAudiofileStatus } from '../selectors/player';

type Props = StateProps;

class AudiofileStatusComponent extends React.PureComponent<Props> {
  public render() {
    const { audiofileStatus } = this.props;

    if (!audiofileStatus) { return null; }

    return <GlobalStatusIndicator label={audiofileStatus} />;
  }
}

interface StateProps {
  audiofileStatus: ReturnType<typeof selectPlayerAudiofileStatus>;
}

const mapStateToProps = (state: RootState): StateProps => ({
  audiofileStatus: selectPlayerAudiofileStatus(state)
});

const mapDispatchToProps = {};

export const AudiofileStatusContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AudiofileStatusComponent);
