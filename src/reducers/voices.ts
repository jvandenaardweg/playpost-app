import { GENERIC_NETWORK_ERROR, GET_LANGUAGES_FAIL_MESSAGE } from '../constants/messages';

export const GET_LANGUAGES = 'voices/GET_LANGUAGES';
export const GET_LANGUAGES_SUCCESS = 'voices/GET_LANGUAGES_SUCCESS';
export const GET_LANGUAGES_FAIL = 'voices/GET_LANGUAGES_FAIL';

export const RESET_VOICES_STATE = 'voices/RESET_VOICES_STATE';
export const SET_DOWNLOADED_VOICE = 'voices/SET_DOWNLOADED_VOICE';
export const RESET_DOWNLOADED_VOICES = 'voices/RESET_DOWNLOADED_VOICES';
export const SET_SELECTED_VOICE_OBJECT = 'voices/SET_SELECTED_VOICE_OBJECT';

export const RESET_VOICES_ERROR = 'voices/RESET_VOICES_ERROR';

export interface SelectedVoice {
  readonly [key: string]: Api.Voice;
}

export type VoicesState = Readonly<{
  isLoading: boolean;
  isLoadingLanguages: boolean;
  downloadedVoicePreviews: ReadonlyArray<Api.Voice>;
  languages: ReadonlyArray<Api.Language>;
  error: string;
}>;

export const initialState: VoicesState = {
  isLoading: false,
  isLoadingLanguages: false,
  downloadedVoicePreviews: [],
  languages: [],
  error: ''
};

/* tslint:disable-next-line no-any */
export function voicesReducer(state = initialState, action: any): VoicesState {
  switch (action.type) {
    case GET_LANGUAGES:
      return {
        ...state,
        isLoadingLanguages: true,
        error: ''
      };

    case GET_LANGUAGES_SUCCESS:
      const languages: Api.Language[] = action.payload.data;

      return {
        ...state,
        languages,
        isLoadingLanguages: false,
        error: ''
      };

    case GET_LANGUAGES_FAIL:
      let getLanguagesFailMessage = '';

      // Network error
      if (action.error && action.error.status === 0) {
        getLanguagesFailMessage = GENERIC_NETWORK_ERROR;
      } else {
        // Error, from the API
        if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
          getLanguagesFailMessage = action.error.response.data.message;
        } else {
          getLanguagesFailMessage = GET_LANGUAGES_FAIL_MESSAGE;
        }
      }

      return {
        ...state,
        isLoadingLanguages: false,
        error: getLanguagesFailMessage
      };

    case SET_DOWNLOADED_VOICE:
      const downloadedVoice: Api.Voice = action.payload;

      return {
        ...state,
        isLoading: false,
        downloadedVoicePreviews: [...state.downloadedVoicePreviews.slice(0, 0), downloadedVoice, ...state.downloadedVoicePreviews.slice(0)]
      };

    case RESET_DOWNLOADED_VOICES:
      return {
        ...state,
        downloadedVoicePreviews: initialState.downloadedVoicePreviews
      };

    case RESET_VOICES_STATE:
      return {
        ...initialState
      };

    case RESET_VOICES_ERROR:
      return {
        ...state,
        error: ''
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

export function resetVoicesError() {
  return {
    type: RESET_VOICES_ERROR
  };
}

export function getLanguages() {
  return {
    type: GET_LANGUAGES,
    payload: {
      request: {
        method: 'get',
        url: '/v1/languages?isActive=true'
      }
    }
  };
}

export function setDownloadedVoice(voice: Api.Voice) {
  return {
    type: SET_DOWNLOADED_VOICE,
    payload: voice
  };
}
