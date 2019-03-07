import Analytics from 'appcenter-analytics';

export const POST_AUTH = 'auth/POST_AUTH';
export const POST_AUTH_SUCCESS = 'auth/POST_AUTH_SUCCESS';
export const POST_AUTH_FAIL = 'auth/POST_AUTH_FAIL';
export const REMOVE_AUTH = 'auth/REMOVE_AUTH';
export const SET_AUTH_TOKEN = 'auth/SET_AUTH_TOKEN';

const POST_AUTH_FAIL_MESSAGE = 'An unknown error happened while loggin you in. Please contact us when this happens all the time.';

const initialState = {
  isLoading: false,
  token: null,
  error: null
};

export function authReducer(state = initialState, action) {
  switch (action.type) {
    case POST_AUTH:
      return {
        ...state,
        isLoading: true
      };

    case POST_AUTH_SUCCESS:
      Analytics.trackEvent('Auth success');

      return {
        ...state,
        isLoading: false,
        token: action.payload.data.token,
        error: null
      };

    case POST_AUTH_FAIL:
      if (action.error.response && action.error.response.data && action.error.response.data.message) {
        Analytics.trackEvent('Error auth', { message: action.error.response.data.message });
      } else {
        Analytics.trackEvent('Error auth', { message: POST_AUTH_FAIL_MESSAGE });
      }

      return {
        ...state,
        isLoading: false,
        token: null,
        error: (action.error.response) ? action.error.response.data.message : POST_AUTH_FAIL_MESSAGE
      };

    case REMOVE_AUTH:
      return {
        ...initialState
      };

    case SET_AUTH_TOKEN:
      return {
        ...state,
        token: action.payload.token
      };

    default:
      return state;
  }
}

export function setAuthToken(token) {
  return {
    type: SET_AUTH_TOKEN,
    payload: {
      token
    }
  };
}

export function removeAuth() {
  return {
    type: REMOVE_AUTH
  };
}

export function postAuth(email, password) {
  return {
    type: POST_AUTH,
    payload: {
      request: {
        method: 'post',
        url: '/v1/auth',
        data: {
          email,
          password
        }
      }
    }
  };
}
