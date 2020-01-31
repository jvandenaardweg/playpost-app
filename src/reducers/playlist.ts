import { CREATE_PLAYLIST_ITEM_FAIL_MESSAGE, GENERIC_NETWORK_ERROR, GET_PLAYLIST_FAIL_MESSAGE, REORDER_PLAYLIST_ITEM_FAIL_MESSAGE } from '../constants/messages';

export const SET_PLAYLIST_ERROR = 'playlist/SET_PLAYLIST_ERROR';
export const SET_PLAYLIST_IS_LOADING_CREATE_ITEM = 'playlist/SET_PLAYLIST_IS_LOADING_CREATE_ITEM';
export const SET_PLAYLIST_IS_LOADING_ARCHIVE_ITEM = 'playlist/SET_PLAYLIST_IS_LOADING_ARCHIVE_ITEM';
export const SET_PLAYLIST_IS_LOADING_UNARCHIVE_ITEM = 'playlist/SET_PLAYLIST_IS_LOADING_UNARCHIVE_ITEM';
export const SET_PLAYLIST_IS_LOADING_FAVORITE_ITEM = 'playlist/SET_PLAYLIST_IS_LOADING_FAVORITE_ITEM';
export const SET_PLAYLIST_IS_LOADING_UNFAVORITE_ITEM = 'playlist/SET_PLAYLIST_IS_LOADING_UNFAVORITE_ITEM';
export const SET_PLAYLIST_IS_LOADING_DELETE_ITEM = 'playlist/SET_PLAYLIST_IS_LOADING_DELETE_ITEM';

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

export const UNARCHIVE_PLAYLIST_ITEM = 'playlist/UNARCHIVE_PLAYLIST_ITEM';

export const FAVORITE_PLAYLIST_ITEM = 'playlist/FAVORITE_PLAYLIST_ITEM';
export const FAVORITE_PLAYLIST_ITEM_SUCCESS = 'playlist/FAVORITE_PLAYLIST_ITEM_SUCCESS';
export const FAVORITE_PLAYLIST_ITEM_FAIL = 'playlist/FAVORITE_PLAYLIST_ITEM_FAIL';

export const UNFAVORITE_PLAYLIST_ITEM = 'playlist/UNFAVORITE_PLAYLIST_ITEM';
export const UNFAVORITE_PLAYLIST_ITEM_SUCCESS = 'playlist/UNFAVORITE_PLAYLIST_ITEM_SUCCESS';
export const UNFAVORITE_PLAYLIST_ITEM_FAIL = 'playlist/UNFAVORITE_PLAYLIST_ITEM_FAIL';

export const DELETE_PLAYLIST_ITEM = 'playlist/DELETE_PLAYLIST_ITEM';
export const DELETE_PLAYLIST_ITEM_SUCCESS = 'playlist/DELETE_PLAYLIST_ITEM_SUCCESS';
export const DELETE_PLAYLIST_ITEM_FAIL = 'playlist/DELETE_PLAYLIST_ITEM_FAIL';

export const REORDER_PLAYLIST_ITEM = 'playlist/REORDER_PLAYLIST_ITEM';
export const REORDER_PLAYLIST_ITEM_SUCCESS = 'playlist/REORDER_PLAYLIST_ITEM_SUCCESS';
export const REORDER_PLAYLIST_ITEM_FAIL = 'playlist/REORDER_PLAYLIST_ITEM_FAIL';

export const RESET_STATE = 'playlist/RESET_STATE';
export const RESET_ERROR_PLAYLIST = 'playlist/RESET_ERROR_PLAYLIST';

export interface PlaylistState {
  isLoading: boolean;
  isLoadingCreateItem: boolean;
  isLoadingFavoriteItem: boolean;
  isLoadingUnFavoriteItem: boolean;
  isLoadingArchiveItem: boolean;
  isLoadingUnArchiveItem: boolean;
  isLoadingReOrderItem: boolean;
  isLoadingDeleteItem: boolean;
  items: Api.PlaylistItem[];
  error: string;
};

export const initialState: PlaylistState = {
  isLoading: false,
  isLoadingCreateItem: false,
  isLoadingFavoriteItem: false,
  isLoadingUnFavoriteItem: false,
  isLoadingArchiveItem: false,
  isLoadingUnArchiveItem: false,
  isLoadingReOrderItem: false,
  isLoadingDeleteItem: false,
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

    case SET_PLAYLIST_IS_LOADING_ARCHIVE_ITEM:
      // When loading, we want to already remove the archived item from the list
      // So the user does not has to wait for the API call to succeed
      // Resulting in a faster perceived archive
      const tempArchivedItems = (action.articleId && action.isLoading) ? state.items.map(item => {
        if (item.article.id === action.articleId) {
          return {
            ...item,
            archivedAt: new Date().toISOString()
          }
        }
        return item
      }) : state.items

      return {
        ...state,
        isLoadingArchiveItem: action.isLoading,
        items: tempArchivedItems,
        error: ''
      };

    case SET_PLAYLIST_IS_LOADING_UNARCHIVE_ITEM:
      // When loading, we want to already remove the archived item from the list
      // So the user does not has to wait for the API call to succeed
      // Resulting in a faster perceived archive
      const tempUnarchivedItems = (action.articleId && action.isLoading) ? state.items.map(item => {
        if (item.article.id === action.articleId) {
          return {
            ...item,
            archivedAt: null
          }
        }
        return item
      }) : state.items

      return {
        ...state,
        isLoadingUnArchiveItem: action.isLoading,
        items: tempUnarchivedItems,
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

    case SET_PLAYLIST_IS_LOADING_FAVORITE_ITEM:
      return {
        ...state,
        isLoadingFavoriteItem: true,
        error: ''
      };

    case SET_PLAYLIST_IS_LOADING_UNFAVORITE_ITEM:
      return {
        ...state,
        isLoadingUnFavoriteItem: true,
        error: ''
      };

    case SET_PLAYLIST_IS_LOADING_DELETE_ITEM:
      // When loading, we want to already remove the archived item from the list
      // So the user does not has to wait for the API call to succeed
      // Resulting in a faster perceived archive
      const tempItemsWithoutDeleted = (action.articleId && action.isLoading) ? state.items.filter(item => item.article.id !== action.articleId) : state.items;

      return {
        ...state,
        isLoadingDeleteItem: action.isLoading,
        items: tempItemsWithoutDeleted,
        error: ''
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

export const addArticleToPlaylistById = (articleId: string) => ({
  type: CREATE_PLAYLIST_ITEM_BY_ID,
  articleId
});

export const setPlaylistIsLoadingCreateItem = (isLoading: boolean) => ({
  type: SET_PLAYLIST_IS_LOADING_CREATE_ITEM,
  isLoading
})

export const setPlaylistIsLoadingFavoriteItem = (isLoading: boolean) => ({
  type: SET_PLAYLIST_IS_LOADING_FAVORITE_ITEM,
  isLoading
})

export const setPlaylistIsLoadingUnFavoriteItem = (isLoading: boolean) => ({
  type: SET_PLAYLIST_IS_LOADING_UNFAVORITE_ITEM,
  isLoading
})

export const setPlaylistIsLoadingDeleteItem = (isLoading: boolean, articleId: string) => ({
  type: SET_PLAYLIST_IS_LOADING_DELETE_ITEM,
  isLoading,
  articleId
})

export const setPlaylistIsLoadingArchiveItem = (isLoading: boolean, articleId: string) => ({
  type: SET_PLAYLIST_IS_LOADING_ARCHIVE_ITEM,
  isLoading,
  articleId
})

export const setPlaylistIsLoadingUnarchiveItem = (isLoading: boolean, articleId: string) => ({
  type: SET_PLAYLIST_IS_LOADING_UNARCHIVE_ITEM,
  isLoading,
  articleId
})

export const deleteArticleFromPlaylist = (articleId: string) => ({
  type: DELETE_PLAYLIST_ITEM,
  articleId
});

export const favoritePlaylistItem = (articleId: string) => ({
  type: FAVORITE_PLAYLIST_ITEM,
  articleId
});

export const unFavoritePlaylistItem = (articleId: string) => ({
  type: UNFAVORITE_PLAYLIST_ITEM,
  articleId
});

export const archivePlaylistItem = (articleId: string) => ({
  type: ARCHIVE_PLAYLIST_ITEM,
  articleId
});

export const unArchivePlaylistItem = (articleId: string) => ({
  type: UNARCHIVE_PLAYLIST_ITEM,
  articleId
});

// Below are methods not in saga's, yet

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
