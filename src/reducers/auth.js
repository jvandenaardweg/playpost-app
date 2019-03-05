import { API_AUTH_URL } from '../api/auth';

export const POST_AUTH = 'auth/POST_AUTH';
export const POST_AUTH_SUCCESS = 'auth/POST_AUTH_SUCCESS';
export const POST_AUTH_FAIL = 'auth/POST_AUTH_FAIL';

export function authReducer(state = { token: null }, action) {
  switch (action.type) {
    case POST_AUTH:
      return {
        ...state,
        isLoading: true
      };
    case POST_AUTH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        token: action.payload.data.token,
        error: null
      };
    case POST_AUTH_FAIL:
      return {
        ...state,
        isLoading: false,
        token: null,
        error: action.error.response.data.message || 'An unknown error happened while loggin you in. Please contact us when this happens all the time.'
      };
    default:
      return state;
  }
}

export function postAuth(email, password) {
  return {
    type: POST_AUTH,
    payload: {
      request: {
        method: 'post',
        url: API_AUTH_URL,
        data: {
          email,
          password
        }
      }
    }
  };
}
