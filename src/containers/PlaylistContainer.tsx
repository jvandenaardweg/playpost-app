import { connect } from 'react-redux';

import { getPlaylist, reOrderPlaylistItem } from '../reducers/playlist';
import { selectArchivedPlaylistItems, selectFavoritedPlaylistItems, selectNewPlaylistItems } from '../selectors/playlist';

import { RootState } from '../reducers';

import { Playlist } from '../components/Playlist';
import { getInAppSubscriptions } from '../reducers/subscriptions';
import { getUser } from '../reducers/user';
import { getLanguages } from '../reducers/voices';
import { selectDownloadedAudiofiles } from '../selectors/audiofiles';

export interface StateProps {
  newPlaylistItems: ReturnType<typeof selectNewPlaylistItems>;
  archivedPlaylistItems: ReturnType<typeof selectArchivedPlaylistItems>;
  favoritedPlaylistItems: ReturnType<typeof selectFavoritedPlaylistItems>;
  downloadedAudiofiles: ReturnType<typeof selectDownloadedAudiofiles>;
}

export interface DispatchProps {
  getPlaylist: typeof getPlaylist;
  getUser: typeof getUser;
  getLanguages: typeof getLanguages;
  getInAppSubscriptions: typeof getInAppSubscriptions;
  reOrderPlaylistItem: typeof reOrderPlaylistItem;
}

const mapStateToProps = (state: RootState) => ({
  newPlaylistItems: selectNewPlaylistItems(state),
  archivedPlaylistItems: selectArchivedPlaylistItems(state),
  favoritedPlaylistItems: selectFavoritedPlaylistItems(state),
  downloadedAudiofiles: selectDownloadedAudiofiles(state)
});

const mapDispatchToProps = {
  getPlaylist,
  getUser,
  getLanguages,
  getInAppSubscriptions,
  reOrderPlaylistItem
};

export const PlaylistContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Playlist);
