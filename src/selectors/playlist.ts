import { createSelector } from 'reselect';
import { RootState } from '../reducers';
import { PlaylistState } from '../reducers/playlist';
import { createDeepEqualSelector } from './index';

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
export const selectAllPlaylistArticles = createDeepEqualSelector(
  selectPlaylistItems,
  (playlistItems) => {
    if (!playlistItems || !playlistItems.length) { return []; }

    // Create a copy of the array, to enforce immutability. Then sort it.
    const sortedPlaylistItems = [...playlistItems].sort((a: Api.PlaylistItem, b: Api.PlaylistItem) => a.order - b.order);

    const articles = sortedPlaylistItems.map(playlistItem => playlistItem.article);

    return articles;
  }
);

export const selectNewPlaylistItems = createDeepEqualSelector(
  selectPlaylistItems,
  (playlistItems) => {
    if (!playlistItems || !playlistItems.length) { return []; }

    const articles = playlistItems
      .filter(playlistItem => !playlistItem.archivedAt)
      .sort((a: Api.PlaylistItem, b: Api.PlaylistItem) => a.order - b.order); // Sort by the custom order

    return articles;
  }
);

export const selectArchivedPlaylistItems = createDeepEqualSelector(
  selectPlaylistItems,
  (playlistItems) => {
    if (!playlistItems || !playlistItems.length) { return []; }

    const archivedPlaylistItems = playlistItems
      .filter(playlistItem => !!playlistItem.archivedAt)
      .sort((a: Api.PlaylistItem, b: Api.PlaylistItem) => {
        const aTime = (a.archivedAt) ? new Date(a.archivedAt).getTime() : 0;
        const bTime = (b.archivedAt) ? new Date(b.archivedAt).getTime() : 0;
        return bTime - aTime;
      });

    return archivedPlaylistItems;
  }
);

export const selectFavoritedPlaylistItems = createDeepEqualSelector(
  selectPlaylistItems,
  (playlistItems) => {
    if (!playlistItems || !playlistItems.length) { return []; }

    const favoritedPlaylistItems = playlistItems
      .filter(playlistItem => !!playlistItem.favoritedAt)
      .sort((a: Api.PlaylistItem, b: Api.PlaylistItem) => {
        const aTime = (a.favoritedAt) ? new Date(a.favoritedAt).getTime() : 0;
        const bTime = (b.favoritedAt) ? new Date(b.favoritedAt).getTime() : 0;
        return bTime - aTime;
      });

    return favoritedPlaylistItems;
  }
);
