import { createSelector } from 'reselect';

const meSelector = state => state.me;

export const getDefaultPlaylist = createSelector(
  meSelector,
  me => {
    if (!me.playlists || !me.playlists.length) return [];

    // For now, we just show one playlist, the default one
    return me.playlists[0];
  }
);

export const getDefaultPlaylistArticles = createSelector(
  getDefaultPlaylist,
  playlist => {
    const { playlistItems } = playlist;

    if (!playlistItems || !playlistItems.length) return [];

    const articles = playlistItems.map((playlistItem) => playlistItem.article);

    return articles;
  }
);
