import { CREATE_PLAYLIST_ITEM_FAIL_MESSAGE, GET_PLAYLIST_FAIL_MESSAGE, REORDER_PLAYLIST_ITEM_FAIL_MESSAGE } from '../../constants/messages';
import { CREATE_PLAYLIST_ITEM, CREATE_PLAYLIST_ITEM_FAIL, CREATE_PLAYLIST_ITEM_SUCCESS, GET_PLAYLIST, GET_PLAYLIST_FAIL, GET_PLAYLIST_SUCCESS, initialState, playlistReducer, REORDER_PLAYLIST_ITEM, REORDER_PLAYLIST_ITEM_FAIL, REORDER_PLAYLIST_ITEM_SUCCESS, RESET_ERROR_PLAYLIST, RESET_STATE, SET_PLAYLIST_IS_LOADING_ARCHIVE_ITEM, SET_PLAYLIST_IS_LOADING_CREATE_ITEM, SET_PLAYLIST_IS_LOADING_DELETE_ITEM, SET_PLAYLIST_IS_LOADING_UNARCHIVE_ITEM } from '../playlist';

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

  it('should handle SET_PLAYLIST_IS_LOADING_CREATE_ITEM with isLoading = true', () => {
    const expectedState = {
      ...initialState,
      isLoadingCreateItem: true
    };

    const isLoading = true;

    expect(
      playlistReducer(initialState, {
        type: SET_PLAYLIST_IS_LOADING_CREATE_ITEM,
        isLoading
      })
    ).toEqual(expectedState);
  });

  it('should handle SET_PLAYLIST_IS_LOADING_CREATE_ITEM with isLoading = false', () => {
    const expectedState = {
      ...initialState,
      isLoadingCreateItem: false
    };

    const isLoading = false;

    expect(
      playlistReducer(initialState, {
        type: SET_PLAYLIST_IS_LOADING_CREATE_ITEM,
        isLoading
      })
    ).toEqual(expectedState);
  });

  it('should handle SET_PLAYLIST_IS_LOADING_ARCHIVE_ITEM with isLoading = true and an articleId', () => {
    const isLoading = true;
    const articleId = playlistMock[0].article.id;

    const mockedInitialState = {
      ...initialState,
      items: playlistMock
    }

    const expectedPlaylistMock = playlistMock.map(playlistItem => {
      if (playlistItem.article.id === articleId) {
        return {
          ...playlistItem,
          archivedAt: new Date().toISOString()
        }
      }

      return playlistItem
    })

    const expectedState = {
      ...initialState,
      isLoadingArchiveItem: true,
      items: expectedPlaylistMock
    };

    expect(
      playlistReducer(mockedInitialState, {
        type: SET_PLAYLIST_IS_LOADING_ARCHIVE_ITEM,
        isLoading,
        articleId
      })
    ).toMatchObject(expectedState);
  });

  it('should handle SET_PLAYLIST_IS_LOADING_ARCHIVE_ITEM with isLoading = true without an articleId', () => {
    const isLoading = true;

    const mockedInitialState = {
      ...initialState,
      items: playlistMock
    }

    const expectedState = {
      ...initialState,
      isLoadingArchiveItem: true,
      items: playlistMock
    };

    expect(
      playlistReducer(mockedInitialState, {
        type: SET_PLAYLIST_IS_LOADING_ARCHIVE_ITEM,
        isLoading
      })
    ).toMatchObject(expectedState);
  });

  it('should handle SET_PLAYLIST_IS_LOADING_UNARCHIVE_ITEM with isLoading = true and an articleId', () => {
    const isLoading = true;
    const articleId = playlistMock[0].article.id;

    const mockedInitialState = {
      ...initialState,
      items: playlistMock
    }

    const expectedPlaylistMock = playlistMock.map(playlistItem => {
      if (playlistItem.article.id === articleId) {
        return {
          ...playlistItem,
          archivedAt: null
        }
      }

      return playlistItem
    })

    const expectedState = {
      ...initialState,
      isLoadingUnArchiveItem: true,
      items: expectedPlaylistMock
    };

    expect(
      playlistReducer(mockedInitialState, {
        type: SET_PLAYLIST_IS_LOADING_UNARCHIVE_ITEM,
        isLoading,
        articleId
      })
    ).toMatchObject(expectedState);
  });


  it('should handle SET_PLAYLIST_IS_LOADING_UNARCHIVE_ITEM with isLoading = true without an articleId', () => {
    const isLoading = true;

    const mockedInitialState = {
      ...initialState,
      items: playlistMock
    }

    const expectedState = {
      ...initialState,
      isLoadingUnArchiveItem: true,
      items: playlistMock
    };

    expect(
      playlistReducer(mockedInitialState, {
        type: SET_PLAYLIST_IS_LOADING_UNARCHIVE_ITEM,
        isLoading
      })
    ).toMatchObject(expectedState);
  });

  it('should handle SET_PLAYLIST_IS_LOADING_DELETE_ITEM with isLoading = true without an articleId', () => {
    const isLoading = true;

    const mockedInitialState = {
      ...initialState,
      items: playlistMock
    }

    const expectedState = {
      ...initialState,
      isLoadingDeleteItem: true,
      items: playlistMock
    };

    expect(
      playlistReducer(mockedInitialState, {
        type: SET_PLAYLIST_IS_LOADING_DELETE_ITEM,
        isLoading
      })
    ).toMatchObject(expectedState);
  });

  it('should handle SET_PLAYLIST_IS_LOADING_DELETE_ITEM with isLoading = false without an articleId', () => {
    const isLoading = false;

    const mockedInitialState = {
      ...initialState,
      items: playlistMock
    }

    const expectedState = {
      ...initialState,
      isLoadingDeleteItem: false,
      items: playlistMock
    };

    expect(
      playlistReducer(mockedInitialState, {
        type: SET_PLAYLIST_IS_LOADING_DELETE_ITEM,
        isLoading
      })
    ).toMatchObject(expectedState);
  });

  it('should handle SET_PLAYLIST_IS_LOADING_DELETE_ITEM with isLoading = true with an articleId', () => {
    const isLoading = true;
    const articleId = playlistMock[0].article.id;

    const mockedInitialState = {
      ...initialState,
      items: playlistMock
    }

    const expectedState = {
      ...initialState,
      isLoadingDeleteItem: true,
      items: playlistMock.filter(playlistItem => playlistItem.article.id !== articleId)
    };

    expect(
      playlistReducer(mockedInitialState, {
        type: SET_PLAYLIST_IS_LOADING_DELETE_ITEM,
        isLoading,
        articleId
      })
    ).toMatchObject(expectedState);
  });

  it('should handle SET_PLAYLIST_IS_LOADING_DELETE_ITEM with isLoading = false with an articleId', () => {
    const isLoading = false;
    const articleId = playlistMock[0].article.id;

    const mockedInitialState = {
      ...initialState,
      items: playlistMock
    }

    const expectedState = {
      ...initialState,
      isLoadingDeleteItem: false,
      items: playlistMock
    };

    expect(
      playlistReducer(mockedInitialState, {
        type: SET_PLAYLIST_IS_LOADING_DELETE_ITEM,
        isLoading,
        articleId
      })
    ).toMatchObject(expectedState);
  });


});
