import { ARCHIVE_PLAYLIST_ITEM_FAIL_MESSAGE, CREATE_PLAYLIST_ITEM_FAIL_MESSAGE, FAVORITE_PLAYLIST_ITEM_FAIL_MESSAGE, GET_PLAYLIST_FAIL_MESSAGE, REMOVE_PLAYLIST_ITEM_FAIL_MESSAGE, REORDER_PLAYLIST_ITEM_FAIL_MESSAGE, UNARCHIVE_PLAYLIST_ITEM_FAIL_MESSAGE, UNFAVORITE_PLAYLIST_ITEM_FAIL_MESSAGE } from '../../constants/messages';
import { ARCHIVE_PLAYLIST_ITEM, ARCHIVE_PLAYLIST_ITEM_FAIL, ARCHIVE_PLAYLIST_ITEM_SUCCESS, CREATE_PLAYLIST_ITEM, CREATE_PLAYLIST_ITEM_FAIL, CREATE_PLAYLIST_ITEM_SUCCESS, FAVORITE_PLAYLIST_ITEM, FAVORITE_PLAYLIST_ITEM_FAIL, FAVORITE_PLAYLIST_ITEM_SUCCESS, GET_PLAYLIST, GET_PLAYLIST_FAIL, GET_PLAYLIST_SUCCESS, initialState, playlistReducer, REMOVE_PLAYLIST_ITEM, REMOVE_PLAYLIST_ITEM_FAIL, REMOVE_PLAYLIST_ITEM_SUCCESS, REORDER_PLAYLIST_ITEM, REORDER_PLAYLIST_ITEM_FAIL, REORDER_PLAYLIST_ITEM_SUCCESS, RESET_ERROR_PLAYLIST, RESET_STATE, UNARCHIVE_PLAYLIST_ITEM, UNARCHIVE_PLAYLIST_ITEM_FAIL, UNARCHIVE_PLAYLIST_ITEM_SUCCESS, UNFAVORITE_PLAYLIST_ITEM, UNFAVORITE_PLAYLIST_ITEM_FAIL, UNFAVORITE_PLAYLIST_ITEM_SUCCESS } from '../playlist';

import playlistMock from '../../../tests/__mocks__/playlist';

describe('playlist reducer', () => {
  it('should return the initial state', () => {
    expect(playlistReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle RESET_STATE', () => {
    const changedState = {
      ...initialState,
      error: 'Something'
    }

    const expectedState = {
      ...initialState
    };

    // Test the reset
    expect(
      playlistReducer(changedState, {
        type: RESET_STATE
      })
    ).toEqual(expectedState);
  });

  it('should handle GET_PLAYLIST', () => {
    const expectedState = {
      ...initialState,
      isLoading: true,
      error: ''
    };

    expect(
      playlistReducer(initialState, {
        type: GET_PLAYLIST
      })
    ).toEqual(expectedState);
  });

  it('should handle GET_PLAYLIST_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      isLoading: false,
      items: playlistMock,
      error: ''
    };

    expect(
      playlistReducer(initialState, {
        type: GET_PLAYLIST_SUCCESS,
        payload: {
          data: playlistMock
        }
      })
    ).toEqual(expectedState);
  });

  it('should handle GET_PLAYLIST_FAIL', () => {
    const expectedState = {
      ...initialState,
      isLoading: false,
      error: GET_PLAYLIST_FAIL_MESSAGE
    };

    expect(
      playlistReducer(initialState, {
        type: GET_PLAYLIST_FAIL
      })
    ).toEqual(expectedState);
  });

  it('should handle RESET_ERROR_PLAYLIST', () => {
    const changedState = {
      ...initialState,
      error: 'Something'
    }

    const expectedState = {
      ...initialState,
      error: ''
    };

    // Test the reset
    expect(
      playlistReducer(changedState, {
        type: RESET_ERROR_PLAYLIST
      })
    ).toEqual(expectedState);
  });

  it('should handle CREATE_PLAYLIST_ITEM', () => {
    const expectedState = {
      ...initialState,
      isLoadingCreateItem: true,
      error: ''
    };

    expect(
      playlistReducer(initialState, {
        type: CREATE_PLAYLIST_ITEM
      })
    ).toEqual(expectedState);
  });

  it('should handle CREATE_PLAYLIST_ITEM_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      isLoadingCreateItem: false,
      error: ''
    };

    expect(
      playlistReducer(initialState, {
        type: CREATE_PLAYLIST_ITEM_SUCCESS,
        payload: {
          data: playlistMock
        }
      })
    ).toEqual(expectedState);
  });

  it('should handle CREATE_PLAYLIST_ITEM_FAIL', () => {
    const expectedState = {
      ...initialState,
      isLoadingCreateItem: false,
      error: CREATE_PLAYLIST_ITEM_FAIL_MESSAGE
    };

    expect(
      playlistReducer(initialState, {
        type: CREATE_PLAYLIST_ITEM_FAIL
      })
    ).toEqual(expectedState);
  });

  it('should handle FAVORITE_PLAYLIST_ITEM', () => {
    const expectedState = {
      ...initialState,
      isLoadingFavoriteItem: true,
      error: ''
    };

    expect(
      playlistReducer(initialState, {
        type: FAVORITE_PLAYLIST_ITEM
      })
    ).toEqual(expectedState);
  });

  it('should handle FAVORITE_PLAYLIST_ITEM_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      isLoadingFavoriteItem: false,
      error: ''
    };

    expect(
      playlistReducer(initialState, {
        type: FAVORITE_PLAYLIST_ITEM_SUCCESS
      })
    ).toEqual(expectedState);
  });

  it('should handle FAVORITE_PLAYLIST_ITEM_FAIL', () => {
    const expectedState = {
      ...initialState,
      isLoadingFavoriteItem: false,
      error: FAVORITE_PLAYLIST_ITEM_FAIL_MESSAGE
    };

    expect(
      playlistReducer(initialState, {
        type: FAVORITE_PLAYLIST_ITEM_FAIL
      })
    ).toEqual(expectedState);
  });

  it('should handle UNFAVORITE_PLAYLIST_ITEM', () => {
    const expectedState = {
      ...initialState,
      isLoadingUnFavoriteItem: true,
      error: ''
    };

    expect(
      playlistReducer(initialState, {
        type: UNFAVORITE_PLAYLIST_ITEM
      })
    ).toEqual(expectedState);
  });

  it('should handle UNFAVORITE_PLAYLIST_ITEM_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      isLoadingUnFavoriteItem: false,
      error: ''
    };

    expect(
      playlistReducer(initialState, {
        type: UNFAVORITE_PLAYLIST_ITEM_SUCCESS
      })
    ).toEqual(expectedState);
  });

  it('should handle UNFAVORITE_PLAYLIST_ITEM_FAIL', () => {
    const expectedState = {
      ...initialState,
      isLoadingUnFavoriteItem: false,
      error: UNFAVORITE_PLAYLIST_ITEM_FAIL_MESSAGE
    };

    expect(
      playlistReducer(initialState, {
        type: UNFAVORITE_PLAYLIST_ITEM_FAIL
      })
    ).toEqual(expectedState);
  });

  it('should handle ARCHIVE_PLAYLIST_ITEM', () => {
    const expectedState = {
      ...initialState,
      isLoadingArchiveItem: true,
      error: ''
    };

    expect(
      playlistReducer(initialState, {
        type: ARCHIVE_PLAYLIST_ITEM
      })
    ).toEqual(expectedState);
  });

  it('should handle ARCHIVE_PLAYLIST_ITEM_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      isLoadingArchiveItem: false,
      error: ''
    };

    expect(
      playlistReducer(initialState, {
        type: ARCHIVE_PLAYLIST_ITEM_SUCCESS
      })
    ).toEqual(expectedState);
  });

  it('should handle ARCHIVE_PLAYLIST_ITEM_FAIL', () => {
    const expectedState = {
      ...initialState,
      isLoadingArchiveItem: false,
      error: ARCHIVE_PLAYLIST_ITEM_FAIL_MESSAGE
    };

    expect(
      playlistReducer(initialState, {
        type: ARCHIVE_PLAYLIST_ITEM_FAIL
      })
    ).toEqual(expectedState);
  });

  it('should handle UNARCHIVE_PLAYLIST_ITEM', () => {
    const expectedState = {
      ...initialState,
      isLoadingUnArchiveItem: true,
      error: ''
    };

    expect(
      playlistReducer(initialState, {
        type: UNARCHIVE_PLAYLIST_ITEM
      })
    ).toEqual(expectedState);
  });

  it('should handle UNARCHIVE_PLAYLIST_ITEM_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      isLoadingUnArchiveItem: false,
      error: ''
    };

    expect(
      playlistReducer(initialState, {
        type: UNARCHIVE_PLAYLIST_ITEM_SUCCESS
      })
    ).toEqual(expectedState);
  });

  it('should handle UNARCHIVE_PLAYLIST_ITEM_FAIL', () => {
    const expectedState = {
      ...initialState,
      isLoadingUnArchiveItem: false,
      error: UNARCHIVE_PLAYLIST_ITEM_FAIL_MESSAGE
    };

    expect(
      playlistReducer(initialState, {
        type: UNARCHIVE_PLAYLIST_ITEM_FAIL
      })
    ).toEqual(expectedState);
  });

  it('should handle REMOVE_PLAYLIST_ITEM', () => {
    const expectedState = {
      ...initialState,
      isLoading: true,
      error: ''
    };

    expect(
      playlistReducer(initialState, {
        type: REMOVE_PLAYLIST_ITEM
      })
    ).toEqual(expectedState);
  });

  it('should handle REMOVE_PLAYLIST_ITEM_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      isLoading: false,
      error: ''
    };

    expect(
      playlistReducer(initialState, {
        type: REMOVE_PLAYLIST_ITEM_SUCCESS
      })
    ).toEqual(expectedState);
  });

  it('should handle REMOVE_PLAYLIST_ITEM_FAIL', () => {
    const expectedState = {
      ...initialState,
      isLoading: false,
      error: REMOVE_PLAYLIST_ITEM_FAIL_MESSAGE
    };

    expect(
      playlistReducer(initialState, {
        type: REMOVE_PLAYLIST_ITEM_FAIL
      })
    ).toEqual(expectedState);
  });

  it('should handle REORDER_PLAYLIST_ITEM', () => {
    const expectedState = {
      ...initialState,
      isLoadingReOrderItem: true,
      error: ''
    };

    expect(
      playlistReducer(initialState, {
        type: REORDER_PLAYLIST_ITEM
      })
    ).toEqual(expectedState);
  });

  it('should handle REORDER_PLAYLIST_ITEM_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      isLoadingReOrderItem: false,
      error: ''
    };

    expect(
      playlistReducer(initialState, {
        type: REORDER_PLAYLIST_ITEM_SUCCESS
      })
    ).toEqual(expectedState);
  });

  it('should handle REORDER_PLAYLIST_ITEM_FAIL', () => {
    const expectedState = {
      ...initialState,
      isLoadingReOrderItem: false,
      error: REORDER_PLAYLIST_ITEM_FAIL_MESSAGE
    };

    expect(
      playlistReducer(initialState, {
        type: REORDER_PLAYLIST_ITEM_FAIL
      })
    ).toEqual(expectedState);
  });
});
