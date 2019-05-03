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
export const getAllPlaylistArticles = createSelector(
  getPlaylistItems,
  (playlistItems) => {
    if (!playlistItems || !playlistItems.length) return [];

    const articles = playlistItems
      .sort((a, b) => a.order - b.order) // Sort by the custom order
      .map(playlistItem => playlistItem.article);

    return articles;
  }
);

export const getNewPlaylistItems = createSelector(
  getPlaylistItems,
  (playlistItems) => {
    if (!playlistItems || !playlistItems.length) return [];

    const articles = playlistItems
      .filter(playlistItem => !playlistItem.archivedAt)
      .sort((a, b) => a.order - b.order); // Sort by the custom order

    return articles;
  }
);

export const getArchivedPlaylistItems = createSelector(
  getPlaylistItems,
  (playlistItems) => {
    if (!playlistItems || !playlistItems.length) return [];

    const archivedPlaylistItems = playlistItems
      .filter(playlistItem => playlistItem.archivedAt)
      .sort((a, b) => {
        const aTime = (a.archivedAt !== null) ? new Date(a.archivedAt).getTime() : 0;
        const bTime = (b.archivedAt !== null) ? new Date(b.archivedAt).getTime() : 0;
        return bTime - aTime;
      });

    return archivedPlaylistItems;
  }
);

export const getFavoritedPlaylistItems = createSelector(
  getPlaylistItems,
  (playlistItems) => {
    if (!playlistItems || !playlistItems.length) return [];

    const favoritedPlaylistItems = playlistItems
      .filter(playlistItem => playlistItem.favoritedAt)
      .sort((a, b) => {
        const aTime = (a.favoritedAt !== null) ? new Date(a.favoritedAt).getTime() : 0;
        const bTime = (b.favoritedAt !== null) ? new Date(b.favoritedAt).getTime() : 0;
        return bTime - aTime;
      });

    return favoritedPlaylistItems;
  }
);
