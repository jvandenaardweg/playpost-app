import Analytics from 'appcenter-analytics';
import { API_CREATE_USER_URL } from '../api/users';

export const CREATE_USER = 'users/CREATE_USER';
export const CREATE_USER_SUCCESS = 'users/CREATE_USER_SUCCESS';
export const CREATE_USER_FAIL = 'users/CREATE_USER_FAIL';

export function usersReducer(state = { user: {} }, action) {
  switch (action.type) {
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
        user: {},
        error: (action.error.response) ? action.error.response.data.message : genericMessage
      };
    default:
      return state;
  }
}

export function createUser(email, password) {
  return {
    type: CREATE_USER,
    payload: {
      request: {
        method: 'post',
        url: API_CREATE_USER_URL,
        data: {
          email,
          password
        }
      }
    }
  };
}
