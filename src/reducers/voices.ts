import Analytics from 'appcenter-analytics';
import { AxiosError, AxiosResponse } from 'axios';

import { GENERIC_NETWORK_ERROR, GET_VOICES_FAIL_MESSAGE } from '../constants/messages';

export const GET_VOICES = 'voices/GET_VOICES';
export const GET_VOICES_SUCCESS = 'voices/GET_VOICES_SUCCESS';
export const GET_VOICES_FAIL = 'voices/GET_VOICES_FAIL';
export const RESET_VOICES_STATE = 'voices/RESET_VOICES_STATE';

export interface VoicesState {
  isLoading: boolean;
  voices: Api.Voice[];
  error: string;
}

const initialState: VoicesState = {
  isLoading: false,
  voices: [],
  error: ''
};

/* tslint:disable no-any */
interface AuthActionTypes {
  type: string;
  payload: any;
  error: AxiosError & AxiosResponse;
}

export function voicesReducer(state = initialState, action: AuthActionTypes): VoicesState {
  switch (action.type) {
    case GET_VOICES:
      return {
        ...state,
        isLoading: true,
        error: ''
      };

    case GET_VOICES_SUCCESS:
      Analytics.trackEvent('Get voices success');

      return {
        ...state,
        isLoading: false,
        voices: action.payload.data,
        error: ''
      };

    case GET_VOICES_FAIL:

      let postAuthFailMessage = '';

      // Network error
      if (action.error.status === 0) {
        postAuthFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error.response && action.error.response.data && action.error.response.data.message) {
          Analytics.trackEvent('Error get voices', { message: action.error.response.data.message });
          postAuthFailMessage = action.error.response.data.message;
        } else {
          Analytics.trackEvent('Error get voices', { message: GET_VOICES_FAIL_MESSAGE });
          postAuthFailMessage = GET_VOICES_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoading: false,
        // voices: [],
        error: postAuthFailMessage
      };

    case RESET_VOICES_STATE:
      return {
        ...initialState
      };

    default:
      return state;
  }
}

export function resetVoicesState() {
  return {
    type: RESET_VOICES_STATE
  };
}

export function getVoices() {
  return {
    type: GET_VOICES,
    payload: {
      request: {
        method: 'get',
        url: '/v1/voices'
      }
    }
  };
}
