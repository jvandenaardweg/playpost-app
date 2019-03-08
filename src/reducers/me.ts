import Analytics from 'appcenter-analytics';

export const GET_USER = 'user/GET_USER';
export const GET_USER_SUCCESS = 'user/GET_USER_SUCCESS';
export const GET_USER_FAIL = 'user/GET_USER_FAIL';

export const GET_USER_PLAYLISTS = 'user/GET_USER_PLAYLISTS';
export const GET_USER_PLAYLISTS_SUCCESS = 'user/GET_USER_PLAYLISTS_SUCCESS';
export const GET_USER_PLAYLISTS_FAIL = 'user/GET_USER_PLAYLISTS_FAIL';

export const REMOVE_ME = 'user/REMOVE_ME';

const GET_USER_FAIL_MESSAGE = 'An unknown error happened while getting your account. Please contact us when this happens all the time.';
const GET_USER_PLAYLISTS_FAIL_MESSAGE = 'An unknown error happened while getting your playlist. Please contact us when this happens all the time.';

export interface MeState {
  isLoading: boolean
  user: Api.User | null
  token: string | null
  playlists: Api.Playlist[]
  error: string | null
}

const initialState: MeState = {
  isLoading: false,
  user: null,
  token: null,
  playlists: [],
  error: null
}
export function meReducer(state = initialState, action: any) {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        isLoading: true
      };
    case GET_USER_SUCCESS:
      Analytics.trackEvent('Get account success');

      return {
        ...state,
        isLoading: false,
        user: action.payload.data,
        error: null
      };
    case GET_USER_FAIL:
      if (action.error.response && action.error.response.data && action.error.response.data.message) {
        Analytics.trackEvent('Error get account', { message: action.error.response.data.message });
      } else {
        Analytics.trackEvent('Error get account', { message: GET_USER_FAIL_MESSAGE });
      }

      return {
        ...state,
        isLoading: false,
        user: null,
        error: (action.error.response) ? action.error.response.data.message : GET_USER_FAIL_MESSAGE
      };

    case GET_USER_PLAYLISTS:
      return {
        ...state,
        isLoading: true
      };
    case GET_USER_PLAYLISTS_SUCCESS:
      Analytics.trackEvent('Get playlist success');

      return {
        ...state,
        isLoading: false,
        playlists: action.payload.data,
        error: null
      };
    case GET_USER_PLAYLISTS_FAIL:
      if (action.error.response && action.error.response.data && action.error.response.data.message) {
        Analytics.trackEvent('Error get playlist', { message: action.error.response.data.message });
      } else {
        Analytics.trackEvent('Error get playlist', { message: GET_USER_PLAYLISTS_FAIL_MESSAGE });
      }

      return {
        ...state,
        isLoading: false,
        playlists: [],
        error: (action.error.response) ? action.error.response.data.message : GET_USER_PLAYLISTS_FAIL_MESSAGE
      };

    case REMOVE_ME:
      return {
        ...initialState
      };
    default:
      return state;
  }
}

export function removeMe() {
  return {
    type: REMOVE_ME
  };
}

export function getMe(token: string) {
  return {
    type: GET_USER,
    payload: {
      request: {
        method: 'get',
        url: '/v1/me',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  };
}

export function getMePlaylists(token: string) {
  return {
    type: GET_USER_PLAYLISTS,
    payload: {
      request: {
        method: 'get',
        url: '/v1/user/playlists',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  };
}
