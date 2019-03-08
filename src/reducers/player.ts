export const GET_AUDIO = 'player/LOAD';
export const GET_AUDIO_SUCCESS = 'player/LOAD_SUCCESS';
export const GET_AUDIO_FAIL = 'player/LOAD_FAIL';
export const SET_PLAYBACK_STATUS = 'player/SET_PLAYBACK_STATUS';
export const SET_TRACK = 'player/SET_TRACK';

export const REMOVE_PLAYER = 'player/REMOVE_PLAYER';

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
    case REMOVE_PLAYER:
      return {
        ...initialState
      };
    default:
      return state;
  }
}

export function removePlayer() {
  return {
    type: REMOVE_PLAYER
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
