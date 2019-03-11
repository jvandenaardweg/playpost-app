import { Track, EventType } from 'react-native-track-player';

export const GET_AUDIO = 'player/LOAD';
export const GET_AUDIO_SUCCESS = 'player/LOAD_SUCCESS';
export const GET_AUDIO_FAIL = 'player/LOAD_FAIL';
export const SET_PLAYBACK_STATUS = 'player/SET_PLAYBACK_STATUS';
export const SET_TRACK = 'player/SET_TRACK';

export const RESET_PLAYER_STATE = 'player/RESET_PLAYER_STATE';

export type PlaybackStatus = 'ready' | 'loading' | 'playing' | 'paused' | 'stopped' | 'buffering' | 'none' | null;

export interface PlayerState {
  track: Track;
  audiofile: Api.Audiofile | {};
  playbackStatus: PlaybackStatus;
}

const initialState: PlayerState = {
  track: {
    id: '',
    url: '',
    title: '',
    artist: ''
  },
  audiofile: {},
  playbackStatus: null
};

export function playerReducer(state = initialState, action: any) {
  switch (action.type) {
    case GET_AUDIO:
      return {
        ...state,
        isLoading: true
      };
    case GET_AUDIO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        audiofile: action.payload.data,
      };
    case GET_AUDIO_FAIL:
      return {
        ...state,
        isLoading: false,
        error: 'Error while fetching a track'
      };
    case SET_PLAYBACK_STATUS:
      return {
        ...state,
        playbackStatus: action.payload
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
    default:
      return state;
  }
}

export function resetPlayerState() {
  return {
    type: RESET_PLAYER_STATE
  };
}

export function setPlaybackStatus(playbackStatus: EventType) {
  return {
    type: SET_PLAYBACK_STATUS,
    payload: playbackStatus
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
