import React from 'react';
import { connect } from 'react-redux';

import { GlobalStatusIndicator } from '../components/GlobalStatusIndicator';

import { RootState } from '../reducers';
import { selectPlayerAudiofileStatus } from '../selectors/player';
import { selectPlaylistIsLoadingCreateItem } from '../selectors/playlist';

type Props = StateProps;

class GlobalStatusIndicatorContainerComponent extends React.PureComponent<Props> {
  render() {
    const { audiofileStatus, playlistIsLoadingCreateItem } = this.props;

    const labelPlaylistIsLoadingCreateItem = (playlistIsLoadingCreateItem) ? 'Adding article...' : '';
    const labelAudiofileStatus = (audiofileStatus) ? audiofileStatus : '';

    const label = labelPlaylistIsLoadingCreateItem || labelAudiofileStatus;

    const isActive = !!labelAudiofileStatus || !!labelPlaylistIsLoadingCreateItem;

    return <GlobalStatusIndicator isActive={isActive} label={label} />;
  }
}

interface StateProps {
  audiofileStatus: ReturnType<typeof selectPlayerAudiofileStatus>;
  playlistIsLoadingCreateItem: ReturnType<typeof selectPlaylistIsLoadingCreateItem>;
}

const mapStateToProps = (state: RootState): StateProps => ({
  audiofileStatus: selectPlayerAudiofileStatus(state),
  playlistIsLoadingCreateItem: selectPlaylistIsLoadingCreateItem(state)
});

const mapDispatchToProps = {};

export const GlobalStatusIndicatorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalStatusIndicatorContainerComponent);
