import { createSelector } from 'reselect';

const meSelector = state => state.me;

export const getDefaultPlaylistArticles = createSelector(
  meSelector,
  me => {
    if (!me.playlists || !me.playlists.length) return [];

    // For now, we just show one playlist, the default one
    const { playlistItems } = me.playlists[0];

    if (!playlistItems || !playlistItems.length) return [];

    const articles = playlistItems.map((playlistItem) => playlistItem.article);

    return articles;
  }
);
