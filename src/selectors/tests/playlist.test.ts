import { playlistSelector, selectPlaylistError, selectPlaylistItems, selectPlaylistIsLoadingCreateItem, selectAllPlaylistArticles, selectNewPlaylistItems, selectArchivedPlaylistItems, selectFavoritedPlaylistItems } from '../playlist';
import { createStore } from 'redux';

import { initialState } from '../../reducers/playlist';
import { rootReducer } from '../../reducers';

import playlistMock from '../../../tests/__mocks__/playlist';

const store = createStore(rootReducer);

const rootState = store.getState();

describe('playlist selector', () => {
  it('should return the initial state', () => {
    expect(playlistSelector(rootState)).toEqual(initialState);
  });

  it('should return the playlist error', () => {
    const exampleState = {
      ...rootState,
      playlist: {
        ...rootState.playlist,
        error: 'Test error'
      }
    };

    expect(selectPlaylistError(exampleState)).toBe('Test error');
  });

  it('should return the playlist items', () => {
    const exampleState = {
      ...rootState,
      playlist: {
        ...rootState.playlist,
        items: playlistMock
      }
    };

    expect(selectPlaylistItems(exampleState)).toMatchObject(playlistMock);
  });

  it('should return the correct loading state when creating a new item', () => {
    const exampleState = {
      ...rootState,
      playlist: {
        ...rootState.playlist,
        isLoadingCreateItem: true
      }
    };

    expect(selectPlaylistIsLoadingCreateItem(exampleState)).toBe(true);
  });

  it('should return all the playlist articles', () => {
    const exampleState = {
      ...rootState,
      playlist: {
        ...rootState.playlist,
        items: playlistMock
      }
    };

    const expected = playlistMock.map(playlistItem => playlistItem.article);

    expect(selectAllPlaylistArticles(exampleState)).toEqual(expected);
  });

  it('should return an empty array when there are no playlist items', () => {
    const exampleState = {
      ...rootState,
      playlist: {
        ...rootState.playlist,
        items: []
      }
    };

    expect(selectAllPlaylistArticles(exampleState)).toEqual([]);
  });

  it('should return all the playlist items that are not archived', () => {
    const exampleState = {
      ...rootState,
      playlist: {
        ...rootState.playlist,
        items: playlistMock
      }
    };

    const expected = playlistMock.filter(playlistItem => !playlistItem.archivedAt);

    expect(selectNewPlaylistItems(exampleState)).toEqual(expected);
  });

  it('should return an empty array when there are no (new) playlist items', () => {
    const exampleState = {
      ...rootState,
      playlist: {
        ...rootState.playlist,
        items: []
      }
    };

    expect(selectNewPlaylistItems(exampleState)).toEqual([]);
  });

  it('should return all the playlist items that are archived', () => {
    const exampleState = {
      ...rootState,
      playlist: {
        ...rootState.playlist,
        items: playlistMock
      }
    };

    const expected = playlistMock
    .filter(playlistItem => playlistItem.archivedAt)
    .sort((a: Api.PlaylistItem, b: Api.PlaylistItem) => {
      const aTime = (a.archivedAt) ? new Date(a.archivedAt).getTime() : 0;
      const bTime = (b.archivedAt) ? new Date(b.archivedAt).getTime() : 0;
      return bTime - aTime;
    });

    expect(selectArchivedPlaylistItems(exampleState)).toEqual(expected);
  });

  it('should return an empty array when there are no (archived) playlist items', () => {
    const exampleState = {
      ...rootState,
      playlist: {
        ...rootState.playlist,
        items: []
      }
    };

    expect(selectArchivedPlaylistItems(exampleState)).toEqual([]);
  });

  it('selectFavoritedPlaylistItems should return all the playlist items that are favorited', () => {
    const exampleState = {
      ...rootState,
      playlist: {
        ...rootState.playlist,
        items: playlistMock
      }
    };

    const expected = playlistMock
    .filter(playlistItem => !!playlistItem.favoritedAt)
    .sort((a: Api.PlaylistItem, b: Api.PlaylistItem) => {
      const aTime = (a.favoritedAt) ? new Date(a.favoritedAt).getTime() : 0;
      const bTime = (b.favoritedAt) ? new Date(b.favoritedAt).getTime() : 0;
      return bTime - aTime;
    });

    expect(selectFavoritedPlaylistItems(exampleState)).toEqual(expected);
  });

  it('selectFavoritedPlaylistItems should return an empty array when there are no playlist items', () => {
    const exampleState = {
      ...rootState,
      playlist: {
        ...rootState.playlist,
        items: []
      }
    };

    expect(selectFavoritedPlaylistItems(exampleState)).toEqual([]);
  });

});
