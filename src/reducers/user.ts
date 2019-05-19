import Analytics from 'appcenter-analytics';

import { GENERIC_NETWORK_ERROR, GET_USER_FAIL_MESSAGE, CREATE_USER_FAIL_MESSAGE, DELETE_USER_FAIL_MESSAGE, UPDATE_USER_PASSWORD_FAIL_MESSAGE, UPDATE_USER_EMAIL_FAIL_MESSAGE, SAVE_SELECTED_VOICE_FAIL_MESSAGE } from '../constants/messages';

export const GET_USER = 'user/GET_USER';
export const GET_USER_SUCCESS = 'user/GET_USER_SUCCESS';
export const GET_USER_FAIL = 'user/GET_USER_FAIL';

export const CREATE_USER = 'user/CREATE_USER';
export const CREATE_USER_SUCCESS = 'user/CREATE_USER_SUCCESS';
export const CREATE_USER_FAIL = 'user/CREATE_USER_FAIL';

export const DELETE_USER = 'user/DELETE_USER';
export const DELETE_USER_SUCCESS = 'user/DELETE_USER_SUCCESS';
export const DELETE_USER_FAIL = 'user/DELETE_USER_FAIL';

export const UPDATE_USER_PASSWORD = 'user/UPDATE_USER_PASSWORD';
export const UPDATE_USER_PASSWORD_SUCCESS = 'user/UPDATE_USER_PASSWORD_SUCCESS';
export const UPDATE_USER_PASSWORD_FAIL = 'user/UPDATE_USER_PASSWORD_FAIL';

export const UPDATE_USER_EMAIL = 'user/UPDATE_USER_EMAIL';
export const UPDATE_USER_EMAIL_SUCCESS = 'user/UPDATE_USER_EMAIL_SUCCESS';
export const UPDATE_USER_EMAIL_FAIL = 'user/UPDATE_USER_EMAIL_FAIL';

export const SAVE_SELECTED_VOICE = 'user/SAVE_SELECTED_VOICE';
export const SAVE_SELECTED_VOICE_SUCCESS = 'user/SAVE_SELECTED_VOICE_SUCCESS';
export const SAVE_SELECTED_VOICE_FAIL = 'user/SAVE_SELECTED_VOICE_FAIL';

export const RESET_USER_STATE = 'user/RESET_USER_STATE';
export const RESET_USER_ERROR = 'user/RESET_USER_ERROR';

export type UserState = Readonly<{
  isLoading: boolean;
  isLoadingDelete: boolean;
  isLoadingUpdatePassword: boolean;
  isLoadingUpdateEmail: boolean;
  isLoadingSaveSelectedVoice: boolean;
  details: Api.User | null;
  error: string;
}>;

export const initialState: UserState = {
  isLoading: false,
  isLoadingDelete: false,
  isLoadingUpdatePassword: false,
  isLoadingUpdateEmail: false,
  isLoadingSaveSelectedVoice: false,
  details: null,
  error: ''
};

/* tslint:disable no-any */
export function userReducer(state = initialState, action: any): UserState {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        isLoading: true,
        error: ''
      };

    case GET_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        details: action.payload.data,
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
        details: null,
        error: getUserFailMessage
      };

    case CREATE_USER:
      return {
        ...state,
        isLoading: true,
        error: ''
      };

    case CREATE_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        details: action.payload.data,
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
        details: null,
        error: createUserFailMessage
      };

    case DELETE_USER:
      return {
        ...state,
        isLoadingDelete: true,
        error: ''
      };

    case DELETE_USER_SUCCESS:
      return {
        ...state,
        isLoadingDelete: false,
        error: ''
      };

    case DELETE_USER_FAIL:
      let deleteUserFailMessage = '';

      // Network error
      if (action.error.status === 0) {
        deleteUserFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error.response && action.error.response.data && action.error.response.data.message) {
          Analytics.trackEvent('Error delete user', { message: action.error.response.data.message });
          deleteUserFailMessage = action.error.response.data.message;
        } else {
          Analytics.trackEvent('Error delete user', { message: DELETE_USER_FAIL_MESSAGE });
          deleteUserFailMessage = DELETE_USER_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingDelete: false,
        error: deleteUserFailMessage
      };

    case UPDATE_USER_PASSWORD:
      return {
        ...state,
        isLoadingUpdatePassword: true,
        error: ''
      };

    case UPDATE_USER_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoadingUpdatePassword: false,
        error: ''
      };

    case UPDATE_USER_PASSWORD_FAIL:
      let updateUserPasswordFailMessage = '';

      // Network error
      if (action.error.status === 0) {
        updateUserPasswordFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error.response && action.error.response.data && action.error.response.data.message) {
          Analytics.trackEvent('Error update user password', { message: action.error.response.data.message });
          updateUserPasswordFailMessage = action.error.response.data.message;
        } else {
          Analytics.trackEvent('Error update user password', { message: UPDATE_USER_PASSWORD_FAIL_MESSAGE });
          updateUserPasswordFailMessage = UPDATE_USER_PASSWORD_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingUpdatePassword: false,
        error: updateUserPasswordFailMessage
      };

    case UPDATE_USER_EMAIL:
      return {
        ...state,
        isLoadingUpdateEmail: true,
        error: ''
      };

    case UPDATE_USER_EMAIL_SUCCESS:
      return {
        ...state,
        isLoadingUpdateEmail: false,
        error: ''
      };

    case UPDATE_USER_EMAIL_FAIL:
      let updateUserEmailFailMessage = '';

      // Network error
      if (action.error.status === 0) {
        updateUserEmailFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error.response && action.error.response.data && action.error.response.data.message) {
          Analytics.trackEvent('Error update user e-mail', { message: action.error.response.data.message });
          updateUserEmailFailMessage = action.error.response.data.message;
        } else {
          Analytics.trackEvent('Error update user e-mail', { message: UPDATE_USER_EMAIL_FAIL_MESSAGE });
          updateUserEmailFailMessage = UPDATE_USER_EMAIL_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingUpdateEmail: false,
        error: updateUserEmailFailMessage
      };

    case SAVE_SELECTED_VOICE:
      return {
        ...state,
        isLoadingSaveSelectedVoice: true,
        error: ''
      };

    case SAVE_SELECTED_VOICE_SUCCESS:
      return {
        ...state,
        isLoadingSaveSelectedVoice: false,
        error: ''
      };

    case SAVE_SELECTED_VOICE_FAIL:

      let saveSelectedVoiceFailMessage = '';

      // Network error
      if (action.error.status === 0) {
        saveSelectedVoiceFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error.response && action.error.response.data && action.error.response.data.message) {
          Analytics.trackEvent('Error get languages', { message: action.error.response.data.message });
          saveSelectedVoiceFailMessage = action.error.response.data.message;
        } else {
          Analytics.trackEvent('Error get languages', { message: SAVE_SELECTED_VOICE_FAIL_MESSAGE });
          saveSelectedVoiceFailMessage = SAVE_SELECTED_VOICE_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingSaveSelectedVoice: false,
        error: saveSelectedVoiceFailMessage
      };

    case RESET_USER_ERROR:
      return {
        ...state,
        error: ''
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

export function resetUserError() {
  return {
    type: RESET_USER_ERROR
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

export function updateUserPassword(password: string) {
  return {
    type: UPDATE_USER_PASSWORD,
    payload: {
      request: {
        method: 'patch',
        url: '/v1/me/password',
        data: {
          password
        }
      }
    }
  };
}

export function updateUserEmail(email: string) {
  return {
    type: UPDATE_USER_EMAIL,
    payload: {
      request: {
        method: 'patch',
        url: '/v1/me/email',
        data: {
          email
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

export function deleteUser() {
  return {
    type: DELETE_USER,
    payload: {
      request: {
        method: 'delete',
        url: '/v1/me'
      }
    }
  };
}

/**
 * Saves the selected voice as a default voice for the voice's language
 *
 * @param voiceId
 */
export function saveSelectedVoice(voiceId: string) {
  return {
    type: SAVE_SELECTED_VOICE,
    payload: {
      request: {
        method: 'post',
        url: '/v1/me/voices',
        data: {
          voiceId
        }
      }
    }
  };
}
