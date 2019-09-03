import DeviceInfo from 'react-native-device-info';

import {
  CREATE_USER_FAIL_MESSAGE,
  DELETE_USER_FAIL_MESSAGE,
  GENERIC_NETWORK_ERROR,
  GET_USER_FAIL_MESSAGE,
  PATCH_USER_FAIL_MESSAGE,
  SAVE_SELECTED_VOICE_FAIL_MESSAGE
} from '../constants/messages';

export const GET_USER = 'user/GET_USER';
export const GET_USER_SUCCESS = 'user/GET_USER_SUCCESS';
export const GET_USER_FAIL = 'user/GET_USER_FAIL';

export const PATCH_USER = 'user/PATCH_USER';
export const PATCH_USER_SUCCESS = 'user/PATCH_USER_SUCCESS';
export const PATCH_USER_FAIL = 'user/PATCH_USER_FAIL';

export const CREATE_USER = 'user/CREATE_USER';
export const CREATE_USER_SUCCESS = 'user/CREATE_USER_SUCCESS';
export const CREATE_USER_FAIL = 'user/CREATE_USER_FAIL';

export const DELETE_USER = 'user/DELETE_USER';
export const DELETE_USER_SUCCESS = 'user/DELETE_USER_SUCCESS';
export const DELETE_USER_FAIL = 'user/DELETE_USER_FAIL';

export const SAVE_SELECTED_VOICE = 'user/SAVE_SELECTED_VOICE';
export const SAVE_SELECTED_VOICE_SUCCESS = 'user/SAVE_SELECTED_VOICE_SUCCESS';
export const SAVE_SELECTED_VOICE_FAIL = 'user/SAVE_SELECTED_VOICE_FAIL';
export const RESET_SAVE_SELECTED_VOICE_ERROR = 'user/RESET_SAVE_SELECTED_VOICE_ERROR';


export const SET_PLAYBACK_SPEED = 'user/SET_PLAYBACK_SPEED';

export const RESET_USER_STATE = 'user/RESET_USER_STATE';
export const RESET_USER_ERROR = 'user/RESET_USER_ERROR';

export type UserState = Readonly<{
  isLoading: boolean;
  isLoadingDelete: boolean;
  isLoadingPatchUser: boolean;
  isLoadingSaveSelectedVoice: boolean;
  details: Api.User | null;
  error: string;
  errorSaveSelectedVoice: string;
  deviceLocale: string;
  playbackSpeed: number;
}>;

export const initialState: UserState = {
  isLoading: false,
  isLoadingDelete: false,
  isLoadingPatchUser: false,
  isLoadingSaveSelectedVoice: false,
  details: null,
  error: '',
  errorSaveSelectedVoice: '',
  deviceLocale: DeviceInfo.getDeviceLocale(),
  playbackSpeed: 1
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
      if (action.error && action.error.status === 0) {
        getUserFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
          getUserFailMessage = action.error.response.data.message;
        } else {
          getUserFailMessage = GET_USER_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoading: false,
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
      if (action.error && action.error.status === 0) {
        createUserFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
          createUserFailMessage = action.error.response.data.message;
        } else {
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
      if (action.error && action.error.status === 0) {
        deleteUserFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
          deleteUserFailMessage = action.error.response.data.message;
        } else {
          deleteUserFailMessage = DELETE_USER_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingDelete: false,
        error: deleteUserFailMessage
      };

    case PATCH_USER:
      return {
        ...state,
        isLoadingPatchUser: true,
        error: ''
      };

    case PATCH_USER_SUCCESS:
      return {
        ...state,
        isLoadingPatchUser: false,
        error: ''
      };

    case PATCH_USER_FAIL:
      let updateUserEmailFailMessage = '';

      // Network error
      if (action.error && action.error.status === 0) {
        updateUserEmailFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
          updateUserEmailFailMessage = action.error.response.data.message;
        } else {
          updateUserEmailFailMessage = PATCH_USER_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingPatchUser: false,
        error: updateUserEmailFailMessage
      };

    case SAVE_SELECTED_VOICE:
      return {
        ...state,
        isLoadingSaveSelectedVoice: true,
        errorSaveSelectedVoice: ''
      };

    case SAVE_SELECTED_VOICE_SUCCESS:
      return {
        ...state,
        isLoadingSaveSelectedVoice: false,
        errorSaveSelectedVoice: ''
      };

    case SAVE_SELECTED_VOICE_FAIL:
      let saveSelectedVoiceFailMessage = '';

      // Network error
      if (action.error && action.error.status === 0) {
        saveSelectedVoiceFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
          saveSelectedVoiceFailMessage = action.error.response.data.message;
        } else {
          saveSelectedVoiceFailMessage = SAVE_SELECTED_VOICE_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingSaveSelectedVoice: false,
        errorSaveSelectedVoice: saveSelectedVoiceFailMessage
      };

    case SET_PLAYBACK_SPEED:
      return {
        ...state,
        playbackSpeed: action.payload
      };

    case RESET_SAVE_SELECTED_VOICE_ERROR:
      return {
        ...state,
        errorSaveSelectedVoice: ''
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

export function resetSaveSelectedVoiceError() {
  return {
    type: RESET_SAVE_SELECTED_VOICE_ERROR
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

export function patchUser({ email, password }: { email?: string, password?: string }) {
  return {
    type: PATCH_USER,
    payload: {
      request: {
        method: 'patch',
        url: '/v1/me',
        data: {
          email,
          password
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

export function setPlaybackSpeed(speed: number) {
  return {
    type: SET_PLAYBACK_SPEED,
    payload: speed
  };
}
