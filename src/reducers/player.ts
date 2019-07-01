import TrackPlayer from 'react-native-track-player';

export const SET_PLAYBACK_STATUS = 'player/SET_PLAYBACK_STATUS';
export const RESET_PLAYBACK_STATUS = 'player/RESET_PLAYBACK_STATUS';
export const SET_TRACK = 'player/SET_TRACK';
export const SET_PLAYBACK_SPEED = 'player/SET_PLAYBACK_SPEED';

export const CREATE_AUDIOFILE = 'player/CREATE_AUDIOFILE';
export const CREATE_AUDIOFILE_SUCCESS = 'player/CREATE_AUDIOFILE_SUCCESS';
export const CREATE_AUDIOFILE_FAIL = 'player/CREATE_AUDIOFILE_FAIL';
export const RESET_CREATE_AUDIOFILE_ERROR =
  'player/RESET_CREATE_AUDIOFILE_ERROR';

export const SET_IS_CREATING_AUDIOFILE = 'player/SET_IS_CREATING_AUDIOFILE';
export const SET_IS_DOWNLOADING_AUDIOFILE =
  'player/SET_IS_DOWNLOADING_AUDIOFILE';
export const RESET_IS_CREATING_AUDIOFILE = 'player/RESET_IS_CREATING_AUDIOFILE';
export const RESET_IS_DOWNLOADING_AUDIOFILE =
  'player/RESET_IS_DOWNLOADING_AUDIOFILE';

export const RESET_PLAYER_STATE = 'player/RESET_PLAYER_STATE';

const CREATE_AUDIOFILE_FAIL_MESSAGE =
  'An unknown error happened while creating creating an audiofile. Please contact us when this happens all the time.';

export type PlayerState = Readonly<{
  track: TrackPlayer.Track;
  audiofile: Api.Audiofile | null;
  articleId: string;
  playbackState: string | number;
  playbackSpeed: number;
  error: string;
  errorCreateAudiofile: string;
  isLoadingCreateAudiofile: boolean;
  isCreatingAudiofile: boolean;
  isDownloadingAudiofile: boolean;
}>;

export const initialState: PlayerState = {
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
  error: '',
  errorCreateAudiofile: '',
  isLoadingCreateAudiofile: false,
  isCreatingAudiofile: false,
  isDownloadingAudiofile: false
};

/* tslint:disable-next-line no-any */
export function playerReducer(state = initialState, action: any): PlayerState {
  switch (action.type) {
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
        playbackState: initialState.playbackState,
        articleId: action.payload.articleId
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
        isLoadingCreateAudiofile: true,
        errorCreateAudiofile: ''
      };

    case CREATE_AUDIOFILE_SUCCESS:
      return {
        ...state,
        isLoadingCreateAudiofile: false,
        audiofile: action.payload.data,
        errorCreateAudiofile: ''
      };

    case CREATE_AUDIOFILE_FAIL:
      let errorCreateAudiofile = CREATE_AUDIOFILE_FAIL_MESSAGE;

      if (
        action.error.response &&
        action.error.response.data &&
        action.error.response.data.message
      ) {
        errorCreateAudiofile = action.error.response.data.message;
      }

      return {
        ...state,
        errorCreateAudiofile,
        isLoadingCreateAudiofile: false,
        isCreatingAudiofile: false
      };

    case RESET_CREATE_AUDIOFILE_ERROR:
      return {
        ...state,
        errorCreateAudiofile: ''
      };

    case SET_IS_CREATING_AUDIOFILE:
      return {
        ...state,
        isCreatingAudiofile: true
      };

    case RESET_IS_CREATING_AUDIOFILE:
      return {
        ...state,
        isCreatingAudiofile: false
      };

    case SET_IS_DOWNLOADING_AUDIOFILE:
      return {
        ...state,
        isDownloadingAudiofile: true
      };

    case RESET_IS_DOWNLOADING_AUDIOFILE:
      return {
        ...state,
        isDownloadingAudiofile: false
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

export function resetCreateAudiofileError() {
  return {
    type: RESET_CREATE_AUDIOFILE_ERROR
  };
}

export function setPlaybackStatus(playbackState: string) {
  return {
    type: SET_PLAYBACK_STATUS,
    payload: playbackState
  };
}

export function resetPlaybackStatus() {
  return {
    type: RESET_PLAYBACK_STATUS
  };
}

export function setTrack(track: TrackPlayer.Track, articleId: string) {
  return {
    type: SET_TRACK,
    payload: {
      track,
      articleId
    }
  };
}

/**
 * Creates an audiofile for the user using the default voice or user selected voice
 * The selection of which voice to use is handled by the API.
 */
export function createAudiofile(articleId: string) {
  return {
    type: CREATE_AUDIOFILE,
    payload: {
      request: {
        method: 'post',
        url: `/v1/articles/${articleId}/audiofiles`,
        data: {
          mimeType: 'audio/mpeg'
        }
      }
    }
  };
}

export function setIsCreatingAudiofile() {
  return {
    type: SET_IS_CREATING_AUDIOFILE
  };
}

export function setIsDownloadingAudiofile() {
  return {
    type: SET_IS_DOWNLOADING_AUDIOFILE
  };
}

export function resetIsCreatingAudiofile() {
  return {
    type: RESET_IS_CREATING_AUDIOFILE
  };
}

export function resetIsDownloadingAudiofile() {
  return {
    type: RESET_IS_DOWNLOADING_AUDIOFILE
  };
}
