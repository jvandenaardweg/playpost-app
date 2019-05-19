import Analytics from 'appcenter-analytics';

import { GENERIC_NETWORK_ERROR, POST_AUTH_FAIL_MESSAGE } from '../constants/messages';

export const POST_AUTH = 'auth/POST_AUTH';
export const POST_AUTH_SUCCESS = 'auth/POST_AUTH_SUCCESS';
export const POST_AUTH_FAIL = 'auth/POST_AUTH_FAIL';
export const RESET_AUTH_STATE = 'auth/RESET_AUTH_STATE';
export const SET_AUTH_TOKEN = 'auth/SET_AUTH_TOKEN';
export const RESET_AUTH_ERROR = 'auth/RESET_AUTH_ERROR';

export type AuthState = Readonly<{
  isLoading: boolean;
  token: string;
  error: string;
}>;

export const initialState: AuthState = {
  isLoading: false,
  token: '',
  error: ''
};

/* tslint:disable-next-line no-any */
export function authReducer(state = initialState, action: any): AuthState {
  switch (action.type) {
    case POST_AUTH:
      return {
        ...state,
        isLoading: true,
        error: ''
      };

    case POST_AUTH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        token: action.payload.data.token,
        error: ''
      };

    case POST_AUTH_FAIL:

      let postAuthFailMessage = '';

      // Network error
      if (action.error.status === 0) {
        postAuthFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error.response && action.error.response.data && action.error.response.data.message) {
          Analytics.trackEvent('Error auth', { message: action.error.response.data.message });
          postAuthFailMessage = action.error.response.data.message;
        } else {
          Analytics.trackEvent('Error auth', { message: POST_AUTH_FAIL_MESSAGE });
          postAuthFailMessage = POST_AUTH_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoading: false,
        token: '',
        error: postAuthFailMessage
      };

    case RESET_AUTH_ERROR:
      return {
        ...state,
        error: ''
      };

    case RESET_AUTH_STATE:
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

export const setAuthToken = (token: string) => ({
  type: SET_AUTH_TOKEN,
  payload: {
    token
  }
});

export const resetAuthState = () => ({
  type: RESET_AUTH_STATE
});

export const resetAuthError = () => ({
  type: RESET_AUTH_ERROR
});

export const postAuth = (email: string, password: string) => ({
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
});
