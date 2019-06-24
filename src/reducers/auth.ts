import { GENERIC_NETWORK_ERROR, POST_AUTH_FAIL_MESSAGE, POST_RESET_PASSWORD_FAIL_MESSAGE } from '../constants/messages';

export const POST_AUTH = 'auth/POST_AUTH';
export const POST_AUTH_SUCCESS = 'auth/POST_AUTH_SUCCESS';
export const POST_AUTH_FAIL = 'auth/POST_AUTH_FAIL';
export const RESET_AUTH_STATE = 'auth/RESET_AUTH_STATE';
export const SET_AUTH_TOKEN = 'auth/SET_AUTH_TOKEN';
export const RESET_AUTH_ERROR = 'auth/RESET_AUTH_ERROR';

export const POST_RESET_PASSWORD = 'auth/POST_RESET_PASSWORD';
export const POST_RESET_PASSWORD_SUCCESS = 'auth/POST_RESET_PASSWORD_SUCCESS';
export const POST_RESET_PASSWORD_FAIL = 'auth/POST_RESET_PASSWORD_FAIL';

export const POST_UPDATE_PASSWORD = 'auth/POST_UPDATE_PASSWORD';
export const POST_UPDATE_PASSWORD_SUCCESS = 'auth/POST_UPDATE_PASSWORD_SUCCESS';
export const POST_UPDATE_PASSWORD_FAIL = 'auth/POST_UPDATE_PASSWORD_FAIL';

export const SET_AUTH_ERROR = 'auth/SET_AUTH_ERROR';
export const GET_AUTH_TOKEN = 'auth/GET_AUTH_TOKEN';

export type AuthState = Readonly<{
  isLoading: boolean;
  isLoadingResetPassword: boolean;
  token: string;
  error: string;
  errorResetPassword: string;
}>;

export const initialState: AuthState = {
  isLoading: false,
  isLoadingResetPassword: false,
  token: '',
  error: '',
  errorResetPassword: ''
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
          postAuthFailMessage = action.error.response.data.message;
        } else {
          postAuthFailMessage = POST_AUTH_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoading: false,
        token: '',
        error: postAuthFailMessage
      };

    case POST_RESET_PASSWORD:
      return {
        ...state,
        isLoadingResetPassword: true,
        error: ''
      };

    case POST_RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoadingResetPassword: false,
        errorResetPassword: ''
      };

    case POST_RESET_PASSWORD_FAIL:

      let postResetPasswordFailMessage = '';

      // Network error
      if (action.error.status === 0) {
        postResetPasswordFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error.response && action.error.response.data && action.error.response.data.message) {
          postResetPasswordFailMessage = action.error.response.data.message;
        } else {
          postResetPasswordFailMessage = POST_RESET_PASSWORD_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingResetPassword: false,
        errorResetPassword: postResetPasswordFailMessage
      };

    case SET_AUTH_ERROR:
      return {
        ...state,
        error: action.errorMessage
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

export const getAuthToken = (email: string, password: string) => ({
  email,
  password,
  type: GET_AUTH_TOKEN
});

export const setAuthToken = (token: string) => ({
  type: SET_AUTH_TOKEN,
  payload: {
    token
  }
});

export const setAuthError = (errorMessage?: string) => ({
  errorMessage,
  type: SET_AUTH_ERROR,
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

export const postResetPassword = (email: string) => ({
  type: POST_RESET_PASSWORD,
  payload: {
    request: {
      method: 'post',
      url: '/v1/auth/reset-password',
      data: {
        email
      }
    }
  }
});

export const postUpdatePassword = (password: string, resetPasswordToken: string) => ({
  type: POST_UPDATE_PASSWORD,
  payload: {
    request: {
      method: 'post',
      url: '/v1/auth/update-password',
      data: {
        resetPasswordToken,
        password
      }
    }
  }
});
