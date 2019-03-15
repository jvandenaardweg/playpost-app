import { Track } from 'react-native-track-player';
import Analytics from 'appcenter-analytics';

export const GET_AUDIOFILE = 'player/LOAD';
export const GET_AUDIOFILE_SUCCESS = 'player/LOAD_SUCCESS';
export const GET_AUDIOFILE_FAIL = 'player/LOAD_FAIL';
export const SET_PLAYBACK_STATUS = 'player/SET_PLAYBACK_STATUS';
export const SET_TRACK = 'player/SET_TRACK';

export const CREATE_AUDIOFILE = 'player/CREATE_AUDIOFILE';
export const CREATE_AUDIOFILE_SUCCESS = 'player/CREATE_AUDIOFILE_SUCCESS';
export const CREATE_AUDIOFILE_FAIL = 'player/CREATE_AUDIOFILE_FAIL';

export const RESET_PLAYER_STATE = 'player/RESET_PLAYER_STATE';

export type PlaybackStatus = 'ready' | 'loading' | 'playing' | 'paused' | 'stopped' | 'buffering' | 'none';

const CREATE_AUDIOFILE_FAIL_MESSAGE = 'An unknown error happened while creating creating an audiofile. Please contact us when this happens all the time.';

export interface PlayerState {
  track: Track;
  audiofile: Api.Audiofile | null;
  article: Api.Article | null;
  playbackState: PlaybackStatus;
  isLoading: boolean;
  error: string | null;
}

const initialState: PlayerState = {
  isLoading: false,
  track: {
    id: '',
    url: '',
    title: '',
    artist: '',
    contentType: '',
    description: '',
    duration: 0
  },
  audiofile: null,
  article: null,
  playbackState: 'none',
  error: null
};

export function playerReducer(state = initialState, action: any): PlayerState {
  switch (action.type) {
    case GET_AUDIOFILE:
      return {
        ...state,
        isLoading: true
      };
    case GET_AUDIOFILE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        audiofile: action.payload.data,
      };
    case GET_AUDIOFILE_FAIL:
      return {
        ...state,
        isLoading: false,
        error: 'Error while fetching a audiofile.'
      };
    case SET_PLAYBACK_STATUS:
      return {
        ...state,
        playbackState: action.payload
      };
    case SET_TRACK:
      return {
        ...state,
        track: action.payload.track,
        audiofile: action.payload.audiofile,
        article: action.payload.article
      };
    case RESET_PLAYER_STATE:
      return {
        ...initialState
      };

    case CREATE_AUDIOFILE:
      return {
        ...state,
        isLoading: true
      };
    case CREATE_AUDIOFILE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        audiofile: action.payload.data,
      };
    case CREATE_AUDIOFILE_FAIL:
      let error = CREATE_AUDIOFILE_FAIL_MESSAGE;

      if (action.error.response && action.error.response.data && action.error.response.data.message) {
        error = action.error.response.data.message;
        Analytics.trackEvent('Error create audiofile', { message: action.error.response.data.message });
      } else {
        Analytics.trackEvent('Error create audiofile', { message: CREATE_AUDIOFILE_FAIL_MESSAGE });
      }

      return {
        ...state,
        error,
        isLoading: false
      };
    default:
      return state;
  }
}

export function resetPlayerState() {
  return {
    type: RESET_PLAYER_STATE
  };
}

export function setPlaybackStatus(playbackState: PlaybackStatus) {
  return {
    type: SET_PLAYBACK_STATUS,
    payload: playbackState
  };
}

export function setTrack(track: Track, audiofile: Api.Audiofile, article: Api.Article) {
  return {
    type: SET_TRACK,
    payload: {
      track,
      audiofile,
      article
    }
  };
}

export function createAudiofile(articleId: string) {
  return {
    type: CREATE_AUDIOFILE,
    payload: {
      request: {
        method: 'post',
        url: `/v1/articles/${articleId}/audiofiles`,
      }
    }
  };
}
