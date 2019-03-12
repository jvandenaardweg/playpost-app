import { Track, EventType } from 'react-native-track-player';

export const GET_AUDIOFILE = 'player/LOAD';
export const GET_AUDIOFILE_SUCCESS = 'player/LOAD_SUCCESS';
export const GET_AUDIOFILE_FAIL = 'player/LOAD_FAIL';
export const SET_PLAYBACK_STATUS = 'player/SET_PLAYBACK_STATUS';
export const SET_TRACK = 'player/SET_TRACK';

export const CREATE_AUDIOFILE = 'player/CREATE_AUDIOFILE';
export const CREATE_AUDIOFILE_SUCCESS = 'player/CREATE_AUDIOFILE_SUCCESS';
export const CREATE_AUDIOFILE_FAIL = 'player/CREATE_AUDIOFILE_FAIL';

export const RESET_PLAYER_STATE = 'player/RESET_PLAYER_STATE';

export type PlaybackStatus = 'ready' | 'loading' | 'playing' | 'paused' | 'stopped' | 'buffering' | 'none' | null;

export interface PlayerState {
  track: Track;
  audiofile: Api.Audiofile | {};
  playbackState: PlaybackStatus;
}

const initialState: PlayerState = {
  track: {
    id: '',
    url: '',
    title: '',
    artist: ''
  },
  audiofile: {},
  playbackState: null
};

export function playerReducer(state = initialState, action: any) {
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
        audiofile: action.payload.audiofile
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
      return {
        ...state,
        isLoading: false,
        error: 'Error while creating an audiofile.'
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

export function setPlaybackStatus(playbackState: EventType) {
  return {
    type: SET_PLAYBACK_STATUS,
    payload: playbackState
  };
}

export function setTrack(track: Track, audiofile: Api.Audiofile) {
  return {
    type: SET_TRACK,
    payload: {
      track,
      audiofile
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
