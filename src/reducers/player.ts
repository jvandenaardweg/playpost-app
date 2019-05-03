import TrackPlayer from 'react-native-track-player';
import Analytics from 'appcenter-analytics';
import { AxiosError } from 'axios';

export const GET_AUDIOFILE = 'player/LOAD';
export const GET_AUDIOFILE_SUCCESS = 'player/LOAD_SUCCESS';
export const GET_AUDIOFILE_FAIL = 'player/LOAD_FAIL';
export const SET_PLAYBACK_STATUS = 'player/SET_PLAYBACK_STATUS';
export const RESET_PLAYBACK_STATUS = 'player/RESET_PLAYBACK_STATUS';
export const SET_TRACK = 'player/SET_TRACK';
export const SET_PLAYBACK_SPEED = 'player/SET_PLAYBACK_SPEED';

export const CREATE_AUDIOFILE = 'player/CREATE_AUDIOFILE';
export const CREATE_AUDIOFILE_SUCCESS = 'player/CREATE_AUDIOFILE_SUCCESS';
export const CREATE_AUDIOFILE_FAIL = 'player/CREATE_AUDIOFILE_FAIL';

export const RESET_PLAYER_STATE = 'player/RESET_PLAYER_STATE';

export type PlaybackStatus = 'ready' | 'loading' | 'playing' | 'paused' | 'stopped' | 'buffering' | 'none';

const CREATE_AUDIOFILE_FAIL_MESSAGE = 'An unknown error happened while creating creating an audiofile. Please contact us when this happens all the time.';

export type PlayerState = Readonly<{
  track: TrackPlayer.Track;
  audiofile: Api.Audiofile | null;
  articleId: string;
  playbackState: PlaybackStatus;
  playbackSpeed: number;
  isLoading: boolean;
  error: string;
}>;

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
  articleId: '',
  playbackState: 'none',
  playbackSpeed: 1,
  error: ''
};

/* tslint:disable no-any */
type PlayerActionTypes = {
  type: string;
  payload: any;
  error: AxiosError;
};

export function playerReducer(state = initialState, action: PlayerActionTypes): PlayerState {
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
        error: ''
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
    case RESET_PLAYBACK_STATUS:
      return {
        ...state,
        playbackState: initialState.playbackState
      };
    case SET_TRACK:
      return {
        ...state,
        track: action.payload.track,
        playbackState: initialState.playbackState
      };
    case SET_PLAYBACK_SPEED:
      return {
        ...state,
        playbackSpeed: action.payload
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

export function resetPlaybackStatus() {
  return {
    type: RESET_PLAYBACK_STATUS,
  };
}

export function setTrack(track: TrackPlayer.Track) {
  return {
    type: SET_TRACK,
    payload: {
      track
    }
  };
}

export function setPlaybackSpeed(playbackSpeed: number) {
  return {
    type: SET_PLAYBACK_SPEED,
    payload: playbackSpeed
  };
}

export function createAudiofile(articleId: string, voiceId: string) {
  return {
    type: CREATE_AUDIOFILE,
    payload: {
      request: {
        method: 'post',
        url: `/v1/articles/${articleId}/audiofiles`,
        data: {
          voiceId,
          mimeType: 'audio/mpeg'
        }
      }
    }
  };
}
