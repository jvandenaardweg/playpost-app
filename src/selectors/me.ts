import { createSelector } from 'reselect';
import { MeState } from '../reducers/me';

const meSelector = (state: any): MeState => state.me;

export const getDefaultPlaylist = createSelector(
  meSelector,
  me => {
    // For now, we just show one playlist, the default one
    return me.playlists[0];
  }
);

export const getDefaultPlaylistArticles = createSelector(
  getDefaultPlaylist,
  playlist => {
    if (!playlist || !playlist.playlistItems || !playlist.playlistItems.length) return [];

    const articles = playlist.playlistItems.map((playlistItem: Api.PlaylistItem) => playlistItem.article);

    return articles;
  }
);
