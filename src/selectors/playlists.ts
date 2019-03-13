import { createSelector } from 'reselect';
import { PlaylistsState } from '../reducers/playlists';
// import console = require('console');

const playlistsSelector = (state: any): PlaylistsState => state.playlists;

export const getPlaylistsError = createSelector(
  playlistsSelector,
  playlists => playlists.error
);

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

/**
 * Get's an audiofile out of a playlist by using the article's ID.
 *
 * Returns `null` when no audiofile is present.
 *
 * Returns `Api.Audiofile` when there's a match.
 */
export const getAudiofileByArticleId = (state: any, articleId: string) => createSelector(
  getDefaultPlaylistArticles,
  (articles) => {
    const article = articles.find(article => article.id === articleId);

    if (!article) return null;

    if (!article.audiofiles || !article.audiofiles.length) return null;

    return article.audiofiles[0];
  }
)(state);
