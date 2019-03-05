import { API_ME_URL } from '../api/me';

export const GET_ME = 'me/GET_ME';
export const GET_ME_SUCCESS = 'me/GET_ME_SUCCESS';
export const GET_ME_FAIL = 'me/GET_ME_FAIL';

export function meReducer(state = { user: {} }, action) {
  switch (action.type) {
    case GET_ME:
      return {
        ...state,
        isLoading: true
      };
    case GET_ME_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload.data,
        error: null
      };
    case GET_ME_FAIL:
      return {
        ...state,
        isLoading: false,
        user: {},
        error: action.error.response.data.message || 'An unknown error happened while getting your account. Please contact us when this happens all the time.'
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
