import Analytics from 'appcenter-analytics';
import { AxiosError, AxiosResponse } from 'axios';

import { GENERIC_NETWORK_ERROR, GET_USER_FAIL_MESSAGE, CREATE_USER_FAIL_MESSAGE } from '../constants/messages';

export const GET_USER = 'user/GET_USER';
export const GET_USER_SUCCESS = 'user/GET_USER_SUCCESS';
export const GET_USER_FAIL = 'user/GET_USER_FAIL';

export const CREATE_USER = 'user/CREATE_USER';
export const CREATE_USER_SUCCESS = 'user/CREATE_USER_SUCCESS';
export const CREATE_USER_FAIL = 'user/CREATE_USER_FAIL';

export const RESET_USER_STATE = 'user/RESET_USER_STATE';

export interface UserState {
  isLoading: boolean;
  user: Api.User | null;
  error: string;
}

const initialState: UserState = {
  isLoading: false,
  user: null,
  error: ''
};

interface UserActionTypes {
  type: string;
  payload: AxiosResponse;
  error: AxiosError & AxiosResponse;
}

export function userReducer(state = initialState, action: UserActionTypes): UserState {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        isLoading: true,
        error: ''
      };

    case GET_USER_SUCCESS:
      Analytics.trackEvent('Get account success');

      return {
        ...state,
        isLoading: false,
        user: action.payload.data,
        error: ''
      };

    case GET_USER_FAIL:
      let getUserFailMessage = '';

      // Network error
      if (action.error.status === 0) {
        getUserFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error.response && action.error.response.data && action.error.response.data.message) {
          Analytics.trackEvent('Error get account', { message: action.error.response.data.message });
          getUserFailMessage = action.error.response.data.message;
        } else {
          Analytics.trackEvent('Error get account', { message: GET_USER_FAIL_MESSAGE });
          getUserFailMessage = GET_USER_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoading: false,
        user: null,
        error: getUserFailMessage
      };

    case CREATE_USER:
      return {
        ...state,
        isLoading: true,
        error: ''
      };

    case CREATE_USER_SUCCESS:
      Analytics.trackEvent('Create user success');

      return {
        ...state,
        isLoading: false,
        user: action.payload.data,
        error: ''
      };

    case CREATE_USER_FAIL:
      let createUserFailMessage = '';

      // Network error
      if (action.error.status === 0) {
        createUserFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error.response && action.error.response.data && action.error.response.data.message) {
          Analytics.trackEvent('Error create user', { message: action.error.response.data.message });
          createUserFailMessage = action.error.response.data.message;
        } else {
          Analytics.trackEvent('Error create user', { message: CREATE_USER_FAIL_MESSAGE });
          createUserFailMessage = CREATE_USER_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoading: false,
        user: null,
        error: createUserFailMessage
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

export function getUser() {
  return {
    type: GET_USER,
    payload: {
      request: {
        method: 'get',
        url: '/v1/me'
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
