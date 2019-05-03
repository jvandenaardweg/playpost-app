import { createSelector } from 'reselect';
import { PlaylistState } from '../reducers/playlist';
import { RootState } from '../reducers';

const playlistSelector = (state: RootState): PlaylistState => state.playlist;

export const getPlaylistIsLoadingCreateItem = createSelector(
  [playlistSelector],
  (playlist): boolean => playlist.isLoadingCreateItem
);

export const getPlaylistItems = createSelector(
  [playlistSelector],
  playlist => playlist.items
);

/**
 * Get's the articles of the default playlist.
 */
export const getPlaylistArticles = createSelector(
  getPlaylistItems,
  (playlistItems) => {
    if (!playlistItems || !playlistItems.length) return [];

    const articles = playlistItems
      .filter(playlistItem => !playlistItem.archivedAt)
      .sort((a, b) => a.order - b.order) // Sort by the custom order
      .map(playlistItem => playlistItem.article);

    return articles;
  }
);

export const getArchivedPlaylistArticles = createSelector(
  getPlaylistItems,
  (playlistItems) => {
    if (!playlistItems || !playlistItems.length) return [];

    const articles = playlistItems
      .filter(playlistItem => playlistItem.archivedAt)
      .sort((a, b) => {
        const aTime = (a.archivedAt !== null) ? new Date(a.archivedAt).getTime() : 0;
        const bTime = (b.archivedAt !== null) ? new Date(b.archivedAt).getTime() : 0;
        return bTime - aTime;
      })
      .map(playlistItem => playlistItem.article);

    return articles;
  }
);

export const getFavoritedPlaylistArticles = createSelector(
  getPlaylistItems,
  (playlistItems): Api.Article[] => {
    if (!playlistItems || !playlistItems.length) return [];

    const articles = playlistItems
      .filter(playlistItem => playlistItem.favoritedAt)
      .sort((a, b) => {
        const aTime = (a.favoritedAt !== null) ? new Date(a.favoritedAt).getTime() : 0;
        const bTime = (b.favoritedAt !== null) ? new Date(b.favoritedAt).getTime() : 0;
        return bTime - aTime;
      })
      .map(playlistItem => playlistItem.article);

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
  getPlaylistArticles,
  (articles): Api.Audiofile | null => {
    const article = articles.find(article => article.id === articleId);

    if (!article) return null;

    if (!article.audiofiles || !article.audiofiles.length) return null;

    return article.audiofiles[0];
  }
)(state);
