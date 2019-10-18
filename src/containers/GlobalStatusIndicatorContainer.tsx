import { connect } from 'react-redux';

import { GlobalStatusIndicator } from '../components/GlobalStatusIndicator';

import { RootState } from '../reducers';
import { selectPlayerAudiofileStatus } from '../selectors/player';
import { selectPlaylistIsLoadingCreateItem } from '../selectors/playlist';

export type Props = StateProps;

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
)(GlobalStatusIndicator);
