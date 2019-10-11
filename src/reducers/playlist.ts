import { ARCHIVE_PLAYLIST_ITEM_FAIL_MESSAGE, CREATE_PLAYLIST_ITEM_FAIL_MESSAGE, FAVORITE_PLAYLIST_ITEM_FAIL_MESSAGE, GENERIC_NETWORK_ERROR, GET_PLAYLIST_FAIL_MESSAGE, REMOVE_PLAYLIST_ITEM_FAIL_MESSAGE, REORDER_PLAYLIST_ITEM_FAIL_MESSAGE, UNARCHIVE_PLAYLIST_ITEM_FAIL_MESSAGE, UNFAVORITE_PLAYLIST_ITEM_FAIL_MESSAGE } from '../constants/messages';

export const SET_PLAYLIST_ERROR = 'playlist/SET_PLAYLIST_ERROR';
export const SET_PLAYLIST_IS_LOADING_CREATE_ITEM = 'playlist/SET_PLAYLIST_IS_LOADING_CREATE_ITEM';

export const GET_PLAYLIST = 'playlist/GET_PLAYLIST';
export const GET_PLAYLIST_SUCCESS = 'playlist/GET_PLAYLIST_SUCCESS';
export const GET_PLAYLIST_FAIL = 'playlist/GET_PLAYLIST_FAIL';

export const CREATE_PLAYLIST_ITEM = 'playlist/CREATE_PLAYLIST_ITEM';
export const CREATE_PLAYLIST_ITEM_SUCCESS = 'playlist/CREATE_PLAYLIST_ITEM_SUCCESS';
export const CREATE_PLAYLIST_ITEM_FAIL = 'playlist/CREATE_PLAYLIST_ITEM_FAIL';

export const CREATE_PLAYLIST_ITEM_BY_ID = 'playlist/CREATE_PLAYLIST_ITEM_BY_ID';
export const CREATE_PLAYLIST_ITEM_BY_ID_SUCCESS = 'playlist/CREATE_PLAYLIST_ITEM_BY_ID_SUCCESS';
export const CREATE_PLAYLIST_ITEM_BY_ID_FAIL = 'playlist/CREATE_PLAYLIST_ITEM_BY_ID_FAIL';

export const ARCHIVE_PLAYLIST_ITEM = 'playlist/ARCHIVE_PLAYLIST_ITEM';
export const ARCHIVE_PLAYLIST_ITEM_SUCCESS = 'playlist/ARCHIVE_PLAYLIST_ITEM_SUCCESS';
export const ARCHIVE_PLAYLIST_ITEM_FAIL = 'playlist/ARCHIVE_PLAYLIST_ITEM_FAIL';

export const UNARCHIVE_PLAYLIST_ITEM = 'playlist/UNARCHIVE_PLAYLIST_ITEM';
export const UNARCHIVE_PLAYLIST_ITEM_SUCCESS = 'playlist/UNARCHIVE_PLAYLIST_ITEM_SUCCESS';
export const UNARCHIVE_PLAYLIST_ITEM_FAIL = 'playlist/UNARCHIVE_PLAYLIST_ITEM_FAIL';

export const FAVORITE_PLAYLIST_ITEM = 'playlist/FAVORITE_PLAYLIST_ITEM';
export const FAVORITE_PLAYLIST_ITEM_SUCCESS = 'playlist/FAVORITE_PLAYLIST_ITEM_SUCCESS';
export const FAVORITE_PLAYLIST_ITEM_FAIL = 'playlist/FAVORITE_PLAYLIST_ITEM_FAIL';

export const UNFAVORITE_PLAYLIST_ITEM = 'playlist/UNFAVORITE_PLAYLIST_ITEM';
export const UNFAVORITE_PLAYLIST_ITEM_SUCCESS = 'playlist/UNFAVORITE_PLAYLIST_ITEM_SUCCESS';
export const UNFAVORITE_PLAYLIST_ITEM_FAIL = 'playlist/UNFAVORITE_PLAYLIST_ITEM_FAIL';

export const REMOVE_PLAYLIST_ITEM = 'playlist/REMOVE_PLAYLIST_ITEM';
export const REMOVE_PLAYLIST_ITEM_SUCCESS = 'playlist/REMOVE_PLAYLIST_ITEM_SUCCESS';
export const REMOVE_PLAYLIST_ITEM_FAIL = 'playlist/REMOVE_PLAYLIST_ITEM_FAIL';

export const REORDER_PLAYLIST_ITEM = 'playlist/REORDER_PLAYLIST_ITEM';
export const REORDER_PLAYLIST_ITEM_SUCCESS = 'playlist/REORDER_PLAYLIST_ITEM_SUCCESS';
export const REORDER_PLAYLIST_ITEM_FAIL = 'playlist/REORDER_PLAYLIST_ITEM_FAIL';

export const RESET_STATE = 'playlist/RESET_STATE';
export const RESET_ERROR_PLAYLIST = 'playlist/RESET_ERROR_PLAYLIST';

export type PlaylistState = Readonly<{
  isLoading: boolean;
  isLoadingCreateItem: boolean;
  isLoadingFavoriteItem: boolean;
  isLoadingUnFavoriteItem: boolean;
  isLoadingArchiveItem: boolean;
  isLoadingUnArchiveItem: boolean;
  isLoadingReOrderItem: boolean;
  items: ReadonlyArray<Api.PlaylistItem>;
  error: string;
}>;

export const initialState: PlaylistState = {
  isLoading: false,
  isLoadingCreateItem: false,
  isLoadingFavoriteItem: false,
  isLoadingUnFavoriteItem: false,
  isLoadingArchiveItem: false,
  isLoadingUnArchiveItem: false,
  isLoadingReOrderItem: false,
  items: [],
  error: ''
};

/* tslint:disable no-any */
export function playlistReducer(state = initialState, action: any): PlaylistState {
  switch (action.type) {
    case GET_PLAYLIST:
      return {
        ...state,
        isLoading: true,
        error: ''
      };

    case SET_PLAYLIST_ERROR:
      return {
        ...state,
        error: action.errorMessage
      };

    case GET_PLAYLIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: action.payload.data,
        error: ''
      };

    case GET_PLAYLIST_FAIL:
      let getPlaylistFailMessage = '';

      // Network error
      if (action.error && action.error.status === 0) {
        getPlaylistFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
          getPlaylistFailMessage = action.error.response.data.message;
        } else {
          getPlaylistFailMessage = GET_PLAYLIST_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoading: false,
        error: getPlaylistFailMessage
      };

    case RESET_STATE:
      return {
        ...initialState
      };

    case RESET_ERROR_PLAYLIST:
      return {
        ...state,
        error: ''
      };


    case SET_PLAYLIST_IS_LOADING_CREATE_ITEM:
      return {
        ...state,
        isLoadingCreateItem: action.isLoading,
        error: ''
      };

    case CREATE_PLAYLIST_ITEM:
      return {
        ...state,
        isLoadingCreateItem: true,
        error: ''
      };

    case CREATE_PLAYLIST_ITEM_SUCCESS:
      return {
        ...state,
        isLoadingCreateItem: false,
        error: ''
      };

    case CREATE_PLAYLIST_ITEM_FAIL:

      let createPlaylistFailMessage = '';

      // Network error
      if (action.error && action.error.status === 0) {
        createPlaylistFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
          createPlaylistFailMessage = action.error.response.data.message;
        } else {
          createPlaylistFailMessage = CREATE_PLAYLIST_ITEM_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingCreateItem: false,
        error: createPlaylistFailMessage
      };

    case FAVORITE_PLAYLIST_ITEM:
      return {
        ...state,
        isLoadingFavoriteItem: true,
        error: ''
      };

    case FAVORITE_PLAYLIST_ITEM_SUCCESS:
      return {
        ...state,
        isLoadingFavoriteItem: false,
        error: ''
      };

    case FAVORITE_PLAYLIST_ITEM_FAIL:

      let favoritePlaylistFailMessage = '';

      // Network error
      if (action.error && action.error.status === 0) {
        favoritePlaylistFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
          favoritePlaylistFailMessage = action.error.response.data.message;
        } else {
          favoritePlaylistFailMessage = FAVORITE_PLAYLIST_ITEM_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingFavoriteItem: false,
        error: favoritePlaylistFailMessage
      };

    case UNFAVORITE_PLAYLIST_ITEM:
      return {
        ...state,
        isLoadingUnFavoriteItem: true,
        error: ''
      };

    case UNFAVORITE_PLAYLIST_ITEM_SUCCESS:
      return {
        ...state,
        isLoadingUnFavoriteItem: false,
        error: ''
      };

    case UNFAVORITE_PLAYLIST_ITEM_FAIL:

      let unfavoritePlaylistFailMessage = '';

      // Network error
      if (action.error && action.error.status === 0) {
        unfavoritePlaylistFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
          unfavoritePlaylistFailMessage = action.error.response.data.message;
        } else {
          unfavoritePlaylistFailMessage = UNFAVORITE_PLAYLIST_ITEM_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingUnFavoriteItem: false,
        error: unfavoritePlaylistFailMessage
      };

    case ARCHIVE_PLAYLIST_ITEM:
      return {
        ...state,
        isLoadingArchiveItem: true,
        error: ''
      };

    case ARCHIVE_PLAYLIST_ITEM_SUCCESS:
      return {
        ...state,
        isLoadingArchiveItem: false,
        error: ''
      };

    case ARCHIVE_PLAYLIST_ITEM_FAIL:

      let archivePlaylistFailMessage = '';

      // Network error
      if (action.error && action.error.status === 0) {
        archivePlaylistFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
          archivePlaylistFailMessage = action.error.response.data.message;
        } else {
          archivePlaylistFailMessage = ARCHIVE_PLAYLIST_ITEM_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingArchiveItem: false,
        error: archivePlaylistFailMessage
      };

    case UNARCHIVE_PLAYLIST_ITEM:
      return {
        ...state,
        isLoadingUnArchiveItem: true,
        error: ''
      };

    case UNARCHIVE_PLAYLIST_ITEM_SUCCESS:
      return {
        ...state,
        isLoadingUnArchiveItem: false,
        error: ''
      };

    case UNARCHIVE_PLAYLIST_ITEM_FAIL:

      let unarchivePlaylistFailMessage = '';

      // Network error
      if (action.error && action.error.status === 0) {
        unarchivePlaylistFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
          unarchivePlaylistFailMessage = action.error.response.data.message;
        } else {
          unarchivePlaylistFailMessage = UNARCHIVE_PLAYLIST_ITEM_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingUnArchiveItem: false,
        error: unarchivePlaylistFailMessage
      };

    case REMOVE_PLAYLIST_ITEM:
      return {
        ...state,
        isLoading: true,
        error: ''
      };

    case REMOVE_PLAYLIST_ITEM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: ''
      };

    case REMOVE_PLAYLIST_ITEM_FAIL:

      let removePlaylistFailMessage = '';

      // Network error
      if (action.error && action.error.status === 0) {
        removePlaylistFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
          removePlaylistFailMessage = action.error.response.data.message;
        } else {
          removePlaylistFailMessage = REMOVE_PLAYLIST_ITEM_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoading: false,
        error: removePlaylistFailMessage
      };

    case REORDER_PLAYLIST_ITEM:
      return {
        ...state,
        isLoadingReOrderItem: true,
        error: ''
      };

    case REORDER_PLAYLIST_ITEM_SUCCESS:
      return {
        ...state,
        isLoadingReOrderItem: false,
        error: ''
      };

    case REORDER_PLAYLIST_ITEM_FAIL:

      let reorderPlaylistFailMessage = '';

      // Network error
      if (action.error && action.error.status === 0) {
        reorderPlaylistFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
          reorderPlaylistFailMessage = action.error.response.data.message;
        } else {
          reorderPlaylistFailMessage = REORDER_PLAYLIST_ITEM_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingReOrderItem: false,
        error: reorderPlaylistFailMessage
      };

    default:
      return state;
  }
}
export const resetPlaylistState = () => ({
  type: RESET_STATE
});

export const resetErrorPlaylist = () => ({
  type: RESET_ERROR_PLAYLIST
});

export const setPlaylistError = (errorMessage?: string) => ({
  errorMessage,
  type: SET_PLAYLIST_ERROR
});

export const getPlaylist = () => ({
  type: GET_PLAYLIST,
  payload: {
    request: {
      method: 'get',
      url: '/v1/playlist'
    }
  }
});

export const addArticleToPlaylistByUrl = (articleUrl: string, documentHtml?: string) => ({
  type: CREATE_PLAYLIST_ITEM,
  payload: {
    request: {
      method: 'post',
      url: 'v1/playlist/articles',
      data: {
        articleUrl,
        documentHtml
      }
    }
  }
});

export const addArticleToPlaylistById = (articleId: string) => ({
  type: CREATE_PLAYLIST_ITEM_BY_ID,
  articleId
});

export const setPlaylistIsLoadingCreateItem = (isLoading: boolean) => ({
  type: SET_PLAYLIST_IS_LOADING_CREATE_ITEM,
  isLoading
})

export const removeArticleFromPlaylist = (articleId: string) => ({
  type: REMOVE_PLAYLIST_ITEM,
  payload: {
    request: {
      method: 'delete',
      url: `v1/playlist/articles/${articleId}`
    }
  }
});

export const favoritePlaylistItem = (articleId: string) => ({
  type: FAVORITE_PLAYLIST_ITEM,
  payload: {
    request: {
      method: 'patch',
      url: `v1/playlist/articles/${articleId}/favoritedat`,
      data: {
        favoritedAt: new Date() // date is ignored on the server, we use server time
      }
    }
  }
});

export const unFavoritePlaylistItem = (articleId: string) => ({
  type: UNFAVORITE_PLAYLIST_ITEM,
  payload: {
    request: {
      method: 'patch',
      url: `v1/playlist/articles/${articleId}/favoritedat`,
      data: {
        favoritedAt: null
      }
    }
  }
});

export const archivePlaylistItem = (articleId: string) => ({
  type: ARCHIVE_PLAYLIST_ITEM,
  payload: {
    request: {
      method: 'patch',
      url: `v1/playlist/articles/${articleId}/archivedat`,
      data: {
        archivedAt: new Date() // date is ignored on the server, we use server time
      }
    }
  }
});

export const unArchivePlaylistItem = (articleId: string) => ({
  type: UNARCHIVE_PLAYLIST_ITEM,
  payload: {
    request: {
      method: 'patch',
      url: `v1/playlist/articles/${articleId}/archivedat`,
      data: {
        archivedAt: null
      }
    }
  }
});

export const reOrderPlaylistItem = (articleId: string, order: number) => ({
  type: REORDER_PLAYLIST_ITEM,
  payload: {
    request: {
      method: 'patch',
      url: `v1/playlist/articles/${articleId}/order`,
      data: {
        order
      }
    }
  }
});
