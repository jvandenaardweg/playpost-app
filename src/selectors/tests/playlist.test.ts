import { playlistSelector, getPlaylistError, getPlaylistItems, getPlaylistIsLoadingCreateItem, getAllPlaylistArticles, getNewPlaylistItems, getArchivedPlaylistItems, getFavoritedPlaylistItems } from '../playlist';
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

    expect(getPlaylistError(exampleState)).toBe('Test error');
  });

  it('should return the playlist items', () => {
    const exampleState = {
      ...rootState,
      playlist: {
        ...rootState.playlist,
        items: playlistMock
      }
    };

    expect(getPlaylistItems(exampleState)).toMatchObject(playlistMock);
  });

  it('should return the correct loading state when creating a new item', () => {
    const exampleState = {
      ...rootState,
      playlist: {
        ...rootState.playlist,
        isLoadingCreateItem: true
      }
    };

    expect(getPlaylistIsLoadingCreateItem(exampleState)).toBe(true);
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

    expect(getAllPlaylistArticles(exampleState)).toEqual(expected);
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

    expect(getNewPlaylistItems(exampleState)).toEqual(expected);
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
    .sort((a, b) => {
      const aTime = (a.archivedAt !== null) ? new Date(a.archivedAt).getTime() : 0;
      const bTime = (b.archivedAt !== null) ? new Date(b.archivedAt).getTime() : 0;
      return bTime - aTime;
    });

    expect(getArchivedPlaylistItems(exampleState)).toEqual(expected);
  });

  it('should return all the playlist items that are favorited', () => {
    const exampleState = {
      ...rootState,
      playlist: {
        ...rootState.playlist,
        items: playlistMock
      }
    };

    const expected = playlistMock
    .filter(playlistItem => playlistItem.favoritedAt)
    .sort((a, b) => {
      const aTime = (a.favoritedAt !== null) ? new Date(a.favoritedAt).getTime() : 0;
      const bTime = (b.favoritedAt !== null) ? new Date(b.favoritedAt).getTime() : 0;
      return bTime - aTime;
    });

    expect(getFavoritedPlaylistItems(exampleState)).toEqual(expected);
  });

});
