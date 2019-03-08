export const GET_AUDIO = 'player/LOAD';
export const GET_AUDIO_SUCCESS = 'player/LOAD_SUCCESS';
export const GET_AUDIO_FAIL = 'player/LOAD_FAIL';
export const SET_PLAYBACK_STATUS = 'player/SET_PLAYBACK_STATUS';
export const SET_TRACK = 'player/SET_TRACK';

export const RESET_PLAYER_STATE = 'player/RESET_PLAYER_STATE';

export interface PlayerState {
  trackUrl: string | null
  track: any // TODO: use type
  playbackStatus: string | null
}

const initialState: PlayerState = {
  trackUrl: null,
  track: {},
  playbackStatus: null
}

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
        trackUrl: action.payload.data.publicFileUrl,
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
        track: action.payload
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

export function getAudioByArticleUrl(articleUrl: string) {
  return {
    type: GET_AUDIO,
    payload: {
      request: {
        url: `/audiofile?url=${articleUrl}`
      }
    }
  };
}

export function setPlaybackStatus(playbackStatus: any) {
  return {
    type: SET_PLAYBACK_STATUS,
    payload: playbackStatus
  };
}

export function setTrack(track: any) {
  return {
    type: SET_TRACK,
    payload: track
  };
}
