import Analytics from 'appcenter-analytics';
import { AxiosError, AxiosResponse } from 'axios';

import { GENERIC_NETWORK_ERROR, GET_VOICES_FAIL_MESSAGE } from '../constants/messages';

export const GET_VOICES = 'voices/GET_VOICES';
export const GET_VOICES_SUCCESS = 'voices/GET_VOICES_SUCCESS';
export const GET_VOICES_FAIL = 'voices/GET_VOICES_FAIL';
export const RESET_VOICES_STATE = 'voices/RESET_VOICES_STATE';
export const SET_SELECTED_VOICE = 'voices/SET_SELECTED_VOICE';
export const SET_DOWNLOADED_VOICE = 'voices/SET_DOWNLOADED_VOICE';
export const RESET_DOWNLOADED_VOICES = 'voices/RESET_DOWNLOADED_VOICES';

export type VoicesState = {
  readonly isLoading: boolean;
  readonly voices: ReadonlyArray<Api.Voice>;
  readonly selectedVoiceId: string;
  readonly downloaded: ReadonlyArray<Api.Voice>;
  readonly error: string;
};

const initialState: VoicesState = {
  isLoading: false,
  voices: [],
  selectedVoiceId: '',
  downloaded: [],
  error: ''
};

/* tslint:disable no-any */
type AuthActionTypes = {
  type: string;
  payload: any;
  error: AxiosError & AxiosResponse;
};

export function voicesReducer(state = initialState, action: AuthActionTypes): VoicesState {
  switch (action.type) {
    case SET_SELECTED_VOICE:
      return {
        ...state,
        selectedVoiceId: action.payload
      };
    case GET_VOICES:
      return {
        ...state,
        isLoading: true,
        error: ''
      };

    case GET_VOICES_SUCCESS:
      Analytics.trackEvent('Get voices success');

      let defaultSelectedVoice;

      if (!state.selectedVoiceId) {
        defaultSelectedVoice = action.payload.data.find((voice: Api.Voice) => voice.name === 'Joanna' && voice.synthesizer === 'AWS');
      }

      const defaultSelectedVoiceId = (defaultSelectedVoice) ? defaultSelectedVoice.id : state.selectedVoiceId;

      return {
        ...state,
        isLoading: false,
        voices: action.payload.data,
        selectedVoiceId: defaultSelectedVoiceId,
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
        error: postAuthFailMessage
      };

    case SET_DOWNLOADED_VOICE:
      const voice: Api.Voice = action.payload;

      return {
        ...state,
        isLoading: false,
        downloaded: [
          ...state.downloaded.slice(0, 0),
          voice,
          ...state.downloaded.slice(0)
        ]
      };

    case RESET_DOWNLOADED_VOICES:
      return {
        ...state,
        downloaded: initialState.downloaded
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

export function resetDownloadedVoices() {
  return {
    type: RESET_DOWNLOADED_VOICES
  };
}

export function getVoices() {
  return {
    type: GET_VOICES,
    payload: {
      request: {
        method: 'get',
        url: '/v1/voices/active'
      }
    }
  };
}

export function setSelectedVoice(voiceId: string) {
  return {
    type: SET_SELECTED_VOICE,
    payload: voiceId
  };
}

export function setDownloadedVoice(voice: Api.Voice) {
  return {
    type: SET_DOWNLOADED_VOICE,
    payload: voice
  };
}
