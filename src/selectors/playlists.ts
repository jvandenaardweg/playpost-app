import { createSelector } from 'reselect';
import { PlaylistsState } from '../reducers/playlists';

const playlistsSelector = (state: any): PlaylistsState => state.playlists;

export const getDefaultPlaylist = createSelector(
  playlistsSelector,
  (playlists): Api.Playlist => {
    // For now, we just show one playlist, the default one
    return playlists.playlists[0];
  }
);

export const getDefaultPlaylistArticles = createSelector(
  getDefaultPlaylist,
  (playlist) => {
    if (!playlist || !playlist.playlistItems || !playlist.playlistItems.length) return [];

    const articles = playlist.playlistItems.map((playlistItem: Api.PlaylistItem) => playlistItem.article);

    return articles;
  }
);
