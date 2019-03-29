import { createSelector } from 'reselect';
import { PlaylistsState } from '../reducers/playlists';
import { RootState } from '../reducers';

const playlistsSelector = (state: RootState): PlaylistsState => state.playlists;

export const getPlaylistsError = createSelector(
  [playlistsSelector],
  (playlists): string => playlists.error
);

export const getPlaylistsIsLoading = createSelector(
  [playlistsSelector],
  (playlists): boolean => playlists.isLoading
);

export const getPlaylistsIsLoadingCreateItem = createSelector(
  [playlistsSelector],
  (playlists): boolean => playlists.isLoadingCreateItem
);

export const getPlaylists = createSelector(
  [playlistsSelector],
  (playlists): Api.Playlist[] => playlists.playlists
);

/**
 * Get's the playlist with the name `Default`.
 * For now, we just show one playlist, the default one
 * The default playlist is created for every user upon creation of their account.
 */
export const getDefaultPlaylist = createSelector(
  [getPlaylists],
  (playlists): Api.Playlist | null => {
    const defaultPlaylist = playlists.find(playlist => playlist.name === 'Default');

    if (!defaultPlaylist) return null;

    return defaultPlaylist;
  }
);

/**
 * Get's the articles of the default playlist.
 */
export const getDefaultPlaylistArticles = createSelector(
  getDefaultPlaylist,
  (playlist): Api.Article[] => {
    if (!playlist || !playlist.playlistItems || !playlist.playlistItems.length) return [];

    const articles = playlist.playlistItems.map(playlistItem => playlistItem.article);

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
export const getAudiofileByArticleId = (state: RootState, articleId: string) => createSelector(
  getDefaultPlaylistArticles,
  (articles): Api.Audiofile | null => {
    const article = articles.find(article => article.id === articleId);

    if (!article) return null;

    if (!article.audiofiles || !article.audiofiles.length) return null;

    return article.audiofiles[0];
  }
)(state);
