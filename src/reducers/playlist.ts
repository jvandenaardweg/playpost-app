import Analytics from 'appcenter-analytics';
import { AxiosResponse, AxiosError } from 'axios';

export const GET_PLAYLIST = 'playlist/GET_PLAYLIST';
export const GET_PLAYLIST_SUCCESS = 'playlist/GET_PLAYLIST_SUCCESS';
export const GET_PLAYLIST_FAIL = 'playlist/GET_PLAYLIST_FAIL';

export const GET_ARTICLE = 'playlist/GET_ARTICLE';
export const GET_ARTICLE_SUCCESS = 'playlist/GET_ARTICLE_SUCCESS';
export const GET_ARTICLE_FAIL = 'playlist/GET_ARTICLE_FAIL';

export const CREATE_PLAYLIST_ITEM = 'playlist/CREATE_PLAYLIST_ITEM';
export const CREATE_PLAYLIST_ITEM_SUCCESS = 'playlist/CREATE_PLAYLIST_ITEM_SUCCESS';
export const CREATE_PLAYLIST_ITEM_FAIL = 'playlist/CREATE_PLAYLIST_ITEM_FAIL';

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

const GET_PLAYLIST_FAIL_MESSAGE = 'An unknown error happened while getting your playlist. Please contact us when this happens all the time.';
const CREATE_PLAYLIST_ITEM_FAIL_MESSAGE = 'An unknown error happened while adding this article to your playlist. Please contact us when this happens all the time.';
const FAVORITE_PLAYLIST_ITEM_FAIL_MESSAGE = 'An unknown error happened while favoriting this article. Please contact us when this happens all the time.';
const UNFAVORITE_PLAYLIST_ITEM_FAIL_MESSAGE = 'An unknown error happened while unfavoriting this article. Please contact us when this happens all the time.';
const ARCHIVE_PLAYLIST_ITEM_FAIL_MESSAGE = 'An unknown error happened while archiving this article. Please contact us when this happens all the time.';
const UNARCHIVE_PLAYLIST_ITEM_FAIL_MESSAGE = 'An unknown error happened while unarchiving this article. Please contact us when this happens all the time.';
const REMOVE_PLAYLIST_ITEM_FAIL_MESSAGE = 'An unknown error happened while removing this article from your playlist. Please contact us when this happens all the time.';
const REORDER_PLAYLIST_ITEM_FAIL_MESSAGE = 'An unknown error happened while re-ordering this article in your playlist. Please contact us when this happens all the time.';
const GET_ARTICLE_FAIL_MESSAGE = 'An unknown error happened while fetching an article. Please contact us when this happens all the time.';

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

const initialState: PlaylistState = {
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

type PlaylistActionTypes = {
  type: string;
  payload: AxiosResponse;
  error: AxiosError;
};

export function playlistReducer(state = initialState, action: PlaylistActionTypes): PlaylistState {
  switch (action.type) {
    case GET_PLAYLIST:
      return {
        ...state,
        isLoading: true
      };

    case GET_PLAYLIST_SUCCESS:
      Analytics.trackEvent('Get playlist success');

      return {
        ...state,
        isLoading: false,
        items: action.payload.data,
        error: ''
      };

    case GET_PLAYLIST_FAIL:
      if (action.error.response && action.error.response.data && action.error.response.data.message) {
        Analytics.trackEvent('Error get playlist', { message: action.error.response.data.message });
      } else {
        Analytics.trackEvent('Error get playlist', { message: GET_PLAYLIST_FAIL_MESSAGE });
      }

      return {
        ...state,
        isLoading: false,
        error: (action.error.response) ? action.error.response.data.message : GET_PLAYLIST_FAIL_MESSAGE
      };

    case GET_ARTICLE:
      return {
        ...state,
        isLoading: true
      };

    case GET_ARTICLE_SUCCESS:
      Analytics.trackEvent('Get article success');

      const article = action.payload.data;

      // Find the default playlist so we can replace the article
      const updatedPlaylistItems = state.items.map((playlistItem) => {
        if (playlistItem.article.id !== article.id) return playlistItem;

        // Replace the article
        playlistItem.article = article;
        return playlistItem;
      });

      return {
        ...state,
        isLoading: false,
        items: updatedPlaylistItems,
        error: ''
      };

    case GET_ARTICLE_FAIL:
      if (action.error.response && action.error.response.data && action.error.response.data.message) {
        Analytics.trackEvent('Error get article', { message: action.error.response.data.message });
      } else {
        Analytics.trackEvent('Error get article', { message: GET_ARTICLE_FAIL_MESSAGE });
      }

      return {
        ...state,
        isLoading: false,
        error: (action.error.response) ? action.error.response.data.message : GET_ARTICLE_FAIL_MESSAGE
      };

    case RESET_STATE:
      return {
        ...initialState
      };

    case CREATE_PLAYLIST_ITEM:
      return {
        ...state,
        isLoadingCreateItem: true
      };

    case CREATE_PLAYLIST_ITEM_SUCCESS:
      Analytics.trackEvent('Create playlist article');

      return {
        ...state,
        isLoadingCreateItem: false,
        error: ''
      };

    case CREATE_PLAYLIST_ITEM_FAIL:
      if (action.error.response && action.error.response.data && action.error.response.data.message) {
        Analytics.trackEvent('Error add article to playlist', { message: action.error.response.data.message });
      } else {
        Analytics.trackEvent('Error add article to playlist', { message: CREATE_PLAYLIST_ITEM_FAIL_MESSAGE });
      }

      return {
        ...state,
        isLoadingCreateItem: false,
        error: (action.error.response) ? action.error.response.data.message : CREATE_PLAYLIST_ITEM_FAIL_MESSAGE
      };

    case FAVORITE_PLAYLIST_ITEM:
      return {
        ...state,
        isLoadingFavoriteItem: true
      };

    case FAVORITE_PLAYLIST_ITEM_SUCCESS:
      Analytics.trackEvent('Favorite playlist article');

      return {
        ...state,
        isLoadingFavoriteItem: false,
        error: ''
      };

    case FAVORITE_PLAYLIST_ITEM_FAIL:
      if (action.error.response && action.error.response.data && action.error.response.data.message) {
        Analytics.trackEvent('Error favorite article', { message: action.error.response.data.message });
      } else {
        Analytics.trackEvent('Error favorite article', { message: FAVORITE_PLAYLIST_ITEM_FAIL_MESSAGE });
      }

      return {
        ...state,
        isLoadingFavoriteItem: false,
        error: (action.error.response) ? action.error.response.data.message : FAVORITE_PLAYLIST_ITEM_FAIL_MESSAGE
      };

    case UNFAVORITE_PLAYLIST_ITEM:
      return {
        ...state,
        isLoadingUnFavoriteItem: true
      };

    case UNFAVORITE_PLAYLIST_ITEM_SUCCESS:
      Analytics.trackEvent('Unfavorite playlist article');

      return {
        ...state,
        isLoadingUnFavoriteItem: false,
        error: ''
      };

    case UNFAVORITE_PLAYLIST_ITEM_FAIL:
      if (action.error.response && action.error.response.data && action.error.response.data.message) {
        Analytics.trackEvent('Error unfavorite article', { message: action.error.response.data.message });
      } else {
        Analytics.trackEvent('Error unfavorite article', { message: UNFAVORITE_PLAYLIST_ITEM_FAIL_MESSAGE });
      }

      return {
        ...state,
        isLoadingUnFavoriteItem: false,
        error: (action.error.response) ? action.error.response.data.message : UNFAVORITE_PLAYLIST_ITEM_FAIL_MESSAGE
      };

    case ARCHIVE_PLAYLIST_ITEM:
      return {
        ...state,
        isLoadingArchiveItem: true
      };

    case ARCHIVE_PLAYLIST_ITEM_SUCCESS:
      Analytics.trackEvent('Archive playlist article');

      return {
        ...state,
        isLoadingArchiveItem: false,
        error: ''
      };

    case ARCHIVE_PLAYLIST_ITEM_FAIL:
      if (action.error.response && action.error.response.data && action.error.response.data.message) {
        Analytics.trackEvent('Error archive article', { message: action.error.response.data.message });
      } else {
        Analytics.trackEvent('Error archive article', { message: ARCHIVE_PLAYLIST_ITEM_FAIL_MESSAGE });
      }

      return {
        ...state,
        isLoadingArchiveItem: false,
        error: (action.error.response) ? action.error.response.data.message : ARCHIVE_PLAYLIST_ITEM_FAIL_MESSAGE
      };

    case UNARCHIVE_PLAYLIST_ITEM:
      return {
        ...state,
        isLoadingUnArchiveItem: true
      };

    case UNARCHIVE_PLAYLIST_ITEM_SUCCESS:
      Analytics.trackEvent('Unarchive playlist article');

      return {
        ...state,
        isLoadingUnArchiveItem: false,
        error: ''
      };

    case UNARCHIVE_PLAYLIST_ITEM_FAIL:
      if (action.error.response && action.error.response.data && action.error.response.data.message) {
        Analytics.trackEvent('Error unarchive article', { message: action.error.response.data.message });
      } else {
        Analytics.trackEvent('Error unarchive article', { message: UNARCHIVE_PLAYLIST_ITEM_FAIL_MESSAGE });
      }

      return {
        ...state,
        isLoadingUnArchiveItem: false,
        error: (action.error.response) ? action.error.response.data.message : UNARCHIVE_PLAYLIST_ITEM_FAIL_MESSAGE
      };

    case REMOVE_PLAYLIST_ITEM:
      return {
        ...state,
        isLoading: true
      };

    case REMOVE_PLAYLIST_ITEM_SUCCESS:
      Analytics.trackEvent('Remove playlist article');

      return {
        ...state,
        isLoading: false,
        error: ''
      };

    case REMOVE_PLAYLIST_ITEM_FAIL:
      if (action.error.response && action.error.response.data && action.error.response.data.message) {
        Analytics.trackEvent('Error remove article from playlist', { message: action.error.response.data.message });
      } else {
        Analytics.trackEvent('Error remove article from playlist', { message: REMOVE_PLAYLIST_ITEM_FAIL_MESSAGE });
      }

      return {
        ...state,
        isLoading: false,
        error: (action.error.response) ? action.error.response.data.message : REMOVE_PLAYLIST_ITEM_FAIL_MESSAGE
      };

    case REORDER_PLAYLIST_ITEM:
      return {
        ...state,
        isLoadingReOrderItem: true
      };

    case REORDER_PLAYLIST_ITEM_SUCCESS:
      Analytics.trackEvent('Re-order playlist article');

      return {
        ...state,
        isLoadingReOrderItem: false,
        error: ''
      };

    case REORDER_PLAYLIST_ITEM_FAIL:
      if (action.error.response && action.error.response.data && action.error.response.data.message) {
        Analytics.trackEvent('Error re-order article', { message: action.error.response.data.message });
      } else {
        Analytics.trackEvent('Error re-order article', { message: REORDER_PLAYLIST_ITEM_FAIL_MESSAGE });
      }

      return {
        ...state,
        isLoadingReOrderItem: false,
        error: (action.error.response) ? action.error.response.data.message : REORDER_PLAYLIST_ITEM_FAIL_MESSAGE
      };

    default:
      return state;
  }
}
export const resetPlaylistState = () => ({
  type: RESET_STATE
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

export const getArticle = (articleId: string) => ({
  type: GET_ARTICLE,
  payload: {
    request: {
      method: 'get',
      url: `/v1/articles/${articleId}`
    }
  }
});

export const addArticleToPlaylistByUrl = (articleUrl: string) => ({
  type: CREATE_PLAYLIST_ITEM,
  payload: {
    request: {
      method: 'post',
      url: 'v1/playlist/articles',
      data: {
        articleUrl
      }
    }
  }
});

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
