import Analytics from 'appcenter-analytics';

export const GET_USER = 'user/GET_USER';
export const GET_USER_SUCCESS = 'user/GET_USER_SUCCESS';
export const GET_USER_FAIL = 'user/GET_USER_FAIL';

export const GET_USER_PLAYLISTS = 'user/GET_USER_PLAYLISTS';
export const GET_USER_PLAYLISTS_SUCCESS = 'user/GET_USER_PLAYLISTS_SUCCESS';
export const GET_USER_PLAYLISTS_FAIL = 'user/GET_USER_PLAYLISTS_FAIL';

export const CREATE_USER = 'user/CREATE_USER';
export const CREATE_USER_SUCCESS = 'user/CREATE_USER_SUCCESS';
export const CREATE_USER_FAIL = 'user/CREATE_USER_FAIL';

export const CREATE_USER_PLAYLIST_ARTICLE = 'user/CREATE_USER_PLAYLIST_ARTICLE';
export const CREATE_USER_PLAYLIST_ARTICLE_SUCCESS = 'user/CREATE_USER_PLAYLIST_ARTICLE_SUCCESS';
export const CREATE_USER_PLAYLIST_ARTICLE_FAIL = 'user/CREATE_USER_PLAYLIST_ARTICLE_FAIL';

export const RESET_USER_STATE = 'user/RESET_USER_STATE';

const GET_USER_FAIL_MESSAGE = 'An unknown error happened while getting your account. Please contact us when this happens all the time.';
const GET_USER_PLAYLISTS_FAIL_MESSAGE = 'An unknown error happened while getting your playlist. Please contact us when this happens all the time.';

export interface UserState {
  isLoading: boolean;
  user: Api.User | null;
  token: string | null;
  playlists: Api.Playlist[];
  error: string | null;
}

const initialState: UserState = {
  isLoading: false,
  user: null,
  token: null,
  playlists: [],
  error: null
};
export function userReducer(state = initialState, action: any) {
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

    case CREATE_USER:
      return {
        ...state,
        isLoading: true
      };

    case CREATE_USER_SUCCESS:
      Analytics.trackEvent('Create user success');

      return {
        ...state,
        isLoading: false,
        user: action.payload.data,
        error: null
      };

    case CREATE_USER_FAIL:
      const genericMessage = 'An unknown error happened while creating your account. Please contact us when this happens all the time.';

      if (action.error.response && action.error.response.data && action.error.response.data.message) {
        Analytics.trackEvent('Error create user', { message: action.error.response.data.message });
      } else {
        Analytics.trackEvent('Error create user', { message: genericMessage });
      }

      return {
        ...state,
        isLoading: false,
        user: null,
        error: (action.error.response) ? action.error.response.data.message : genericMessage
      };

    case RESET_USER_STATE:
      return {
        ...initialState
      };

    default:
      return state;
  }
}

export function resetUserState() {
  return {
    type: RESET_USER_STATE
  };
}

export function getUser(token: string) {
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

export function getUserPlaylists(token: string) {
  return {
    type: GET_USER_PLAYLISTS,
    payload: {
      request: {
        method: 'get',
        url: '/v1/me/playlists',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  };
}

export function createUser(email: string, password: string) {
  return {
    type: CREATE_USER,
    payload: {
      request: {
        method: 'post',
        url: '/v1/users',
        data: {
          email,
          password
        }
      }
    }
  };
}

export function createUserPlaylistArticle(articleId: string, playlistId: string, token: string) {
  return {
    type: CREATE_USER_PLAYLIST_ARTICLE,
    payload: {
      request: {
        method: 'post',
        url: `v1/playlists/${playlistId}/articles/${articleId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  };
}
