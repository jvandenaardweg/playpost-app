import { createSelector } from 'reselect';
import { UserState } from '../reducers/user';

const userSelector = (state: any): UserState => state.user;

export const getDefaultPlaylist = createSelector(
  userSelector,
  (user) => {
    // For now, we just show one playlist, the default one
    return user.playlists[0];
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
