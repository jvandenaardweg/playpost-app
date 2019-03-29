import Analytics from 'appcenter-analytics';
import { AxiosResponse, AxiosError } from 'axios';

export const GET_PLAYLISTS = 'playlists/GET_PLAYLISTS';
export const GET_PLAYLISTS_SUCCESS = 'playlists/GET_PLAYLISTS_SUCCESS';
export const GET_PLAYLISTS_FAIL = 'playlists/GET_PLAYLISTS_FAIL';

export const GET_ARTICLE = 'playlists/GET_ARTICLE';
export const GET_ARTICLE_SUCCESS = 'playlists/GET_ARTICLE_SUCCESS';
export const GET_ARTICLE_FAIL = 'playlists/GET_ARTICLE_FAIL';

export const CREATE_PLAYLIST_ITEM = 'playlists/CREATE_PLAYLIST_ITEM';
export const CREATE_PLAYLIST_ITEM_SUCCESS = 'playlists/CREATE_PLAYLIST_ITEM_SUCCESS';
export const CREATE_PLAYLIST_ITEM_FAIL = 'playlists/CREATE_PLAYLIST_ITEM_FAIL';

export const REMOVE_PLAYLIST_ITEM = 'playlists/REMOVE_PLAYLIST_ITEM';
export const REMOVE_PLAYLIST_ITEM_SUCCESS = 'playlists/REMOVE_PLAYLIST_ITEM_SUCCESS';
export const REMOVE_PLAYLIST_ITEM_FAIL = 'playlists/REMOVE_PLAYLIST_ITEM_FAIL';

export const RESET_STATE = 'playlists/RESET_STATE';

const GET_PLAYLISTS_FAIL_MESSAGE = 'An unknown error happened while getting your playlist. Please contact us when this happens all the time.';
const CREATE_PLAYLIST_ITEM_FAIL_MESSAGE = 'An unknown error happened while adding this article to your playlist. Please contact us when this happens all the time.';
const REMOVE_PLAYLIST_ITEM_FAIL_MESSAGE = 'An unknown error happened while removing this article from your playlist. Please contact us when this happens all the time.';
const GET_ARTICLE_FAIL_MESSAGE = 'An unknown error happened while fetching an article. Please contact us when this happens all the time.';

export interface PlaylistsState {
  isLoading: boolean;
  isLoadingCreateItem: boolean;
  playlists: Api.Playlist[];
  error: string;
}

const initialState: PlaylistsState = {
  isLoading: false,
  isLoadingCreateItem: false,
  playlists: [],
  error: ''
};

interface PlaylistActionTypes {
  type: string;
  payload: AxiosResponse;
  error: AxiosError;
}

export function playlistsReducer(state = initialState, action: PlaylistActionTypes): PlaylistsState {
  switch (action.type) {
    case GET_PLAYLISTS:
      return {
        ...state,
        isLoading: true
      };

    case GET_PLAYLISTS_SUCCESS:
      Analytics.trackEvent('Get playlists success');

      return {
        ...state,
        isLoading: false,
        playlists: action.payload.data,
        error: ''
      };

    case GET_PLAYLISTS_FAIL:
      if (action.error.response && action.error.response.data && action.error.response.data.message) {
        Analytics.trackEvent('Error get playlist', { message: action.error.response.data.message });
      } else {
        Analytics.trackEvent('Error get playlist', { message: GET_PLAYLISTS_FAIL_MESSAGE });
      }

      return {
        ...state,
        isLoading: false,
        error: (action.error.response) ? action.error.response.data.message : GET_PLAYLISTS_FAIL_MESSAGE
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
      const updatedPlaylists = state.playlists.map((playlist) => {
        if (playlist.name === 'Default') {
          playlist.playlistItems.map((playlistItem) => {
            if (playlistItem.article.id !== article.id) return playlistItem;

            // Replace the article
            return playlistItem.article = article;
          });
        }

        return playlist;
      });

      return {
        ...state,
        isLoading: false,
        playlists: updatedPlaylists,
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

    default:
      return state;
  }
}

export function resetPlaylistsState() {
  return {
    type: RESET_STATE
  };
}

export function getPlaylists() {
  return {
    type: GET_PLAYLISTS,
    payload: {
      request: {
        method: 'get',
        url: '/v1/me/playlists'
      }
    }
  };
}

export function getArticle(articleId: string) {
  return {
    type: GET_ARTICLE,
    payload: {
      request: {
        method: 'get',
        url: `/v1/articles/${articleId}`
      }
    }
  };
}

export function addArticleToPlaylistByUrl(articleUrl: string, playlistId: string) {
  return {
    type: CREATE_PLAYLIST_ITEM,
    payload: {
      request: {
        method: 'post',
        url: `v1/playlists/${playlistId}/articles`,
        data: {
          articleUrl
        }
      }
    }
  };
}

export function removeArticleFromPlaylist(articleId: string, playlistId: string) {
  return {
    type: REMOVE_PLAYLIST_ITEM,
    payload: {
      request: {
        method: 'delete',
        url: `v1/playlists/${playlistId}/articles/${articleId}`
      }
    }
  };
}
