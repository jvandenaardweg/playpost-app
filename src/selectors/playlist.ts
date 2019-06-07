import { createSelector } from 'reselect';
import { PlaylistState } from '../reducers/playlist';
import { RootState } from '../reducers';

export const playlistSelector = (state: RootState): PlaylistState => state.playlist;

export const selectPlaylistError = createSelector(
  [playlistSelector],
  playlist => playlist.error
);

export const selectPlaylistItems = createSelector(
  [playlistSelector],
  playlist => playlist.items
);

export const selectPlaylistIsLoadingCreateItem = createSelector(
  [playlistSelector],
  (playlist): boolean => playlist.isLoadingCreateItem
);

/**
 * Get's the articles of the default playlist.
 */
export const selectAllPlaylistArticles = createSelector(
  selectPlaylistItems,
  (playlistItems) => {
    if (!playlistItems || !playlistItems.length) return [];

    // Create a copy of the array, to enforce immutability. Then sort it.
    const sortedPlaylistItems = [...playlistItems].sort((a, b) => a.order - b.order);

    const articles = sortedPlaylistItems.map(playlistItem => playlistItem.article);

    return articles;
  }
);

export const selectNewPlaylistItems = createSelector(
  selectPlaylistItems,
  (playlistItems) => {
    if (!playlistItems || !playlistItems.length) return [];

    const articles = playlistItems
      .filter(playlistItem => !playlistItem.archivedAt)
      .sort((a, b) => a.order - b.order); // Sort by the custom order

    return articles;
  }
);

export const selectArchivedPlaylistItems = createSelector(
  selectPlaylistItems,
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

export const selectFavoritedPlaylistItems = createSelector(
  selectPlaylistItems,
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
