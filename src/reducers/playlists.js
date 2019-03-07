import Analytics from 'appcenter-analytics';
import { API_PLAYLISTS_URL } from '../api/playlists';

export const POST_PLAYLISTS_ARTICLES = 'auth/POST_PLAYLISTS_ARTICLES';
export const POST_PLAYLISTS_ARTICLES_SUCCESS = 'auth/POST_PLAYLISTS_ARTICLES_SUCCESS';
export const POST_PLAYLISTS_ARTICLES_FAIL = 'auth/POST_PLAYLISTS_ARTICLES_FAIL';

const POST_PLAYLISTS_ARTICLES_FAIL_MESSAGE = 'An unknown error happened while loggin you in. Please contact us when this happens all the time.';

const initialState = {
  isLoading: false,
  token: null,
  error: null
};

export function authReducer(state = initialState, action) {
  switch (action.type) {
    case POST_PLAYLISTS_ARTICLES:
      return {
        ...state,
        isLoading: true
      };
    case POST_PLAYLISTS_ARTICLES_SUCCESS:
      Analytics.trackEvent('Add article to playlist success');

      return {
        ...state,
        isLoading: false,
        token: action.payload.data.token,
        error: null
      };
    case POST_PLAYLISTS_ARTICLES_FAIL:
      if (action.error.response && action.error.response.data && action.error.response.data.message) {
        Analytics.trackEvent('Error add article to playlist', { message: action.error.response.data.message });
      } else {
        Analytics.trackEvent('Error add article to playlist', { message: POST_PLAYLISTS_ARTICLES_FAIL_MESSAGE });
      }

      return {
        ...state,
        isLoading: false,
        error: (action.error.response) ? action.error.response.data.message : POST_PLAYLISTS_ARTICLES_FAIL_MESSAGE
      };
    default:
      return state;
  }
}

export function postAddArticleToPlaylist(articleId, playlistId) {
  return {
    type: POST_PLAYLISTS_ARTICLES,
    payload: {
      request: {
        method: 'post',
        url: `${API_PLAYLISTS_URL}/${playlistId}/articles/${articleId}`
      }
    }
  };
}
