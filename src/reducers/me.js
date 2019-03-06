import Analytics from 'appcenter-analytics';
import { API_ME_URL, API_ME_PLAYLISTS_URL } from '../api/me';

export const GET_ME = 'me/GET_ME';
export const GET_ME_SUCCESS = 'me/GET_ME_SUCCESS';
export const GET_ME_FAIL = 'me/GET_ME_FAIL';

export const GET_ME_PLAYLISTS = 'me/GET_ME_PLAYLISTS';
export const GET_ME_PLAYLISTS_SUCCESS = 'me/GET_ME_PLAYLISTS_SUCCESS';
export const GET_ME_PLAYLISTS_FAIL = 'me/GET_ME_PLAYLISTS_FAIL';

const GET_ME_FAIL_MESSAGE = 'An unknown error happened while getting your account. Please contact us when this happens all the time.';
const GET_ME_PLAYLISTS_FAIL_MESSAGE = 'An unknown error happened while getting your playlist. Please contact us when this happens all the time.';

export function meReducer(state = { user: {}, playlists: [] }, action) {
  switch (action.type) {
    case GET_ME:
      return {
        ...state,
        isLoading: true
      };
    case GET_ME_SUCCESS:
      Analytics.trackEvent('Get account success');

      return {
        ...state,
        isLoading: false,
        user: action.payload.data,
        error: null
      };
    case GET_ME_FAIL:
      if (action.error.response && action.error.response.data && action.error.response.data.message) {
        Analytics.trackEvent('Error get account', { message: action.error.response.data.message });
      } else {
        Analytics.trackEvent('Error get account', { message: GET_ME_FAIL_MESSAGE });
      }

      return {
        ...state,
        isLoading: false,
        user: {},
        error: (action.error.response) ? action.error.response.data.message : GET_ME_FAIL_MESSAGE
      };

    case GET_ME_PLAYLISTS:
      return {
        ...state,
        isLoading: true
      };
    case GET_ME_PLAYLISTS_SUCCESS:
      Analytics.trackEvent('Get playlist success');

      return {
        ...state,
        isLoading: false,
        playlists: action.payload.data,
        error: null
      };
    case GET_ME_PLAYLISTS_FAIL:
      if (action.error.response && action.error.response.data && action.error.response.data.message) {
        Analytics.trackEvent('Error get playlist', { message: action.error.response.data.message });
      } else {
        Analytics.trackEvent('Error get playlist', { message: GET_ME_PLAYLISTS_FAIL_MESSAGE });
      }

      return {
        ...state,
        isLoading: false,
        playlists: [],
        error: (action.error.response) ? action.error.response.data.message : GET_ME_PLAYLISTS_FAIL_MESSAGE
      };
    default:
      return state;
  }
}

export function getMe(token) {
  return {
    type: GET_ME,
    payload: {
      request: {
        method: 'get',
        url: API_ME_URL,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  };
}

export function getMePlaylists(token) {
  return {
    type: GET_ME_PLAYLISTS,
    payload: {
      request: {
        method: 'get',
        url: API_ME_PLAYLISTS_URL,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  };
}
