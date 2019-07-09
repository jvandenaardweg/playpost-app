import {
  GENERIC_NETWORK_ERROR,
  POST_AUTH_FAIL_MESSAGE,
  POST_REQUEST_RESET_PASSWORD_TOKEN_FAIL_MESSAGE,
  POST_UPDATE_PASSWORD_FAIL_MESSAGE
} from '../constants/messages';

export const POST_AUTH = 'auth/POST_AUTH';
export const POST_AUTH_SUCCESS = 'auth/POST_AUTH_SUCCESS';
export const POST_AUTH_FAIL = 'auth/POST_AUTH_FAIL';
export const RESET_AUTH_STATE = 'auth/RESET_AUTH_STATE';
export const SET_AUTH_TOKEN = 'auth/SET_AUTH_TOKEN';
export const RESET_AUTH_ERROR = 'auth/RESET_AUTH_ERROR';

export const POST_REQUEST_RESET_PASSWORD_TOKEN = 'auth/POST_REQUEST_RESET_PASSWORD_TOKEN';
export const POST_REQUEST_RESET_PASSWORD_TOKEN_SUCCESS = 'auth/POST_REQUEST_RESET_PASSWORD_TOKEN_SUCCESS';
export const POST_REQUEST_RESET_PASSWORD_TOKEN_FAIL = 'auth/POST_REQUEST_RESET_PASSWORD_TOKEN_FAIL';
export const RESET_ERROR_REQUEST_RESET_PASSWORD_TOKEN = 'auth/RESET_ERROR_REQUEST_RESET_PASSWORD_TOKEN';

export const POST_UPDATE_PASSWORD = 'auth/POST_UPDATE_PASSWORD';
export const POST_UPDATE_PASSWORD_SUCCESS = 'auth/POST_UPDATE_PASSWORD_SUCCESS';
export const POST_UPDATE_PASSWORD_FAIL = 'auth/POST_UPDATE_PASSWORD_FAIL';
export const RESET_ERROR_UPDATE_PASSWORD = 'auth/RESET_ERROR_UPDATE_PASSWORD';

export const SET_AUTH_ERROR = 'auth/SET_AUTH_ERROR';
export const GET_AUTH_TOKEN = 'auth/GET_AUTH_TOKEN';

export type AuthState = Readonly<{
  isLoading: boolean;
  isLoadingResetPassword: boolean;
  isLoadingUpdatePassword: boolean;
  token: string;
  error: string;
  errorRequestResetPasswordToken: string;
  errorUpdatePassword: string;
}>;

export const initialState: AuthState = {
  isLoading: false,
  isLoadingResetPassword: false,
  isLoadingUpdatePassword: false,
  token: '',
  error: '',
  errorRequestResetPasswordToken: '',
  errorUpdatePassword: ''
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
      if (action.error && action.error.status === 0) {
        postAuthFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
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

    case POST_REQUEST_RESET_PASSWORD_TOKEN:
      return {
        ...state,
        isLoadingResetPassword: true,
        errorRequestResetPasswordToken: ''
      };

    case POST_REQUEST_RESET_PASSWORD_TOKEN_SUCCESS:
      return {
        ...state,
        isLoadingResetPassword: false,
        errorRequestResetPasswordToken: ''
      };

    case POST_REQUEST_RESET_PASSWORD_TOKEN_FAIL:
      let postResetPasswordFailMessage = '';

      // Network error
      if (action.error && action.error.status === 0) {
        postResetPasswordFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
          postResetPasswordFailMessage = action.error.response.data.message;
        } else {
          postResetPasswordFailMessage = POST_REQUEST_RESET_PASSWORD_TOKEN_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingResetPassword: false,
        errorRequestResetPasswordToken: postResetPasswordFailMessage
      };

    case POST_UPDATE_PASSWORD:
      return {
        ...state,
        isLoadingUpdatePassword: true,
        errorUpdatePassword: ''
      };

    case POST_UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoadingUpdatePassword: false,
        errorUpdatePassword: ''
      };

    case POST_UPDATE_PASSWORD_FAIL:
      let postUpdatePasswordFailMessage = '';

      // Network error
      if (action.error && action.error.status === 0) {
        postUpdatePasswordFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
          postUpdatePasswordFailMessage = action.error.response.data.message;
        } else {
          postUpdatePasswordFailMessage = POST_UPDATE_PASSWORD_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingUpdatePassword: false,
        errorUpdatePassword: postUpdatePasswordFailMessage
      };

    case RESET_ERROR_UPDATE_PASSWORD:
      return {
        ...state,
        errorUpdatePassword: ''
      };

    case RESET_ERROR_REQUEST_RESET_PASSWORD_TOKEN:
      return {
        ...state,
        errorRequestResetPasswordToken: ''
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
  type: SET_AUTH_ERROR
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

export const postRequestResetPasswordToken = (email: string) => ({
  type: POST_REQUEST_RESET_PASSWORD_TOKEN,
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

export const resetErrorUpdatePassword = () => ({
  type: RESET_ERROR_UPDATE_PASSWORD
});

export const resetErrorRequestPasswordToken = () => ({
  type: RESET_ERROR_REQUEST_RESET_PASSWORD_TOKEN
});
